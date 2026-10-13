import {
  createReadStream,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createDecipheriv, createHash, scryptSync } from "node:crypto";
import { spawnSync } from "node:child_process";

const MAGIC = Buffer.from("SVRCORE1", "ascii");
const ARCHIVE_NAME = "short-video-reconstruction-core.tar.gz.aes";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const archivePath = join(scriptDir, ARCHIVE_NAME);

function readSecret(prompt) {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) {
    throw new Error("请在交互式终端中运行安装器并手动输入密码。");
  }
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  return new Promise((resolvePromise, reject) => {
    let value = "";
    const finish = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("data", onData);
      process.stdout.write("\n");
    };
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === "\u0003") {
          finish();
          reject(new Error("安装已取消。"));
          return;
        }
        if (char === "\r" || char === "\n") {
          finish();
          resolvePromise(value);
          return;
        }
        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
        } else {
          value += char;
        }
      }
    };
    process.stdin.on("data", onData);
  });
}

function sha256(path) {
  return new Promise((resolvePromise, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(path);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolvePromise(hash.digest("hex")));
  });
}

function verifyArchiveHash() {
  const sumsPath = join(scriptDir, "SHA256SUMS");
  if (!existsSync(sumsPath)) throw new Error("缺少 SHA256SUMS，无法验证下载完整性。");
  const line = readFileSync(sumsPath, "utf8")
    .split(/\r?\n/)
    .find((item) => item.trim().endsWith(ARCHIVE_NAME));
  if (!line) throw new Error("SHA256SUMS 中没有核心包记录。");
  return line.trim().split(/\s+/)[0].toLowerCase();
}

function validateTarListing(tarGzPath) {
  const result = spawnSync("tar", ["-tzf", tarGzPath], { encoding: "utf8" });
  if (result.status !== 0) throw new Error("核心包不是有效的 tar.gz 文件，已停止解压。");
  for (const raw of result.stdout.split(/\r?\n/)) {
    const entry = raw.replace(/^\.\//, "");
    if (!entry) continue;
    if (isAbsolute(entry) || /^[A-Za-z]:/.test(entry) || entry.split(/[\\/]+/).includes("..")) {
      throw new Error(`检测到不安全的压缩包路径：${entry}`);
    }
  }
}

const targetArgIndex = process.argv.indexOf("--target");
const targetDir = resolve(targetArgIndex >= 0 ? process.argv[targetArgIndex + 1] : scriptDir);
if (!existsSync(archivePath)) throw new Error(`缺少 ${ARCHIVE_NAME}。`);

const expectedHash = verifyArchiveHash();
const actualHash = await sha256(archivePath);
if (actualHash !== expectedHash) throw new Error("核心包 SHA-256 校验失败，请重新下载仓库。");

const password = await readSecret("请输入核心包密码：");
if (!password) throw new Error("密码不能为空。");

const payload = readFileSync(archivePath);
if (payload.length < 52 || !payload.subarray(0, 8).equals(MAGIC)) {
  throw new Error("核心包格式不正确。");
}

const salt = payload.subarray(8, 24);
const iv = payload.subarray(24, 36);
const tag = payload.subarray(36, 52);
const ciphertext = payload.subarray(52);
const key = scryptSync(password, salt, 32, {
  N: 131072,
  r: 8,
  p: 1,
  maxmem: 256 * 1024 * 1024,
});
const decipher = createDecipheriv("aes-256-gcm", key, iv);
decipher.setAAD(Buffer.concat([MAGIC, salt, iv]));
decipher.setAuthTag(tag);

let plaintext;
try {
  plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
} catch {
  throw new Error("密码错误，或核心包已损坏。");
}

const tempDir = mkdtempSync(join(tmpdir(), "short-video-reconstruction-"));
const tarGzPath = join(tempDir, "core.tar.gz");
try {
  writeFileSync(tarGzPath, plaintext);
  validateTarListing(tarGzPath);
  const extracted = spawnSync("tar", ["-xzf", tarGzPath, "-C", targetDir], { stdio: "inherit" });
  if (extracted.status !== 0) throw new Error("解压失败，请确认系统已安装 tar。 ");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

console.log(`\n安装完成：${targetDir}`);
console.log("请从该目录启动 Codex 或让其他智能体读取 AGENTS.md 与 .agents/skills。 ");

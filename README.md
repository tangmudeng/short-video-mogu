# 短视频拆解复刻

> 🚀 **一句话安装到 Codex、Claude Code、Cursor 或其他智能体：复制下面整段话发给它即可。安装器会在终端中隐藏密码输入，密码不会交给智能体或写入项目。**

```text
请帮我安装“短视频拆解复刻”：克隆 https://github.com/zjj231154-droid/short-video-reconstruction 的最新 main 分支，确认本机已有 Git、Node.js 和 tar 后，在克隆目录运行 Windows 的 ./install.ps1 或 macOS/Linux 的 ./install.sh；安装器要求密码时暂停，让我直接在终端中输入，不要索取、记录、回显或转发密码；解密完成后检查 AGENTS.md 与 .agents/skills，如果是 Codex 就从项目根目录启动，如果是其他智能体则按其项目指令和 Agent Skills 兼容方式加载；最后只告诉我安装目录、识别到的技能、可用功能与缺少的可选平台 CLI，不要替我登录平台，也不要写入、索取或上传 API Key、Cookie、Token 或 CLI 登录凭据。
```

这是一个公开可下载、核心内容加密的 AI 短视频制作项目。README、安装器和少量范例图公开可见；技能、工具、脚本、角色资料、剧本、分镜、提示词与分析文档位于 AES-256-GCM 加密包中。密码不会保存在 GitHub。

## 快速安装

需要 [Git](https://git-scm.com/downloads)、[Node.js](https://nodejs.org/en/download) 和系统 `tar` 命令。

Windows PowerShell：

```powershell
git clone https://github.com/zjj231154-droid/short-video-reconstruction.git
cd short-video-reconstruction
.\install.ps1
```

macOS / Linux：

```bash
git clone https://github.com/zjj231154-droid/short-video-reconstruction.git
cd short-video-reconstruction
chmod +x install.sh
./install.sh
```

也可以[下载仓库 ZIP](https://github.com/zjj231154-droid/short-video-reconstruction/archive/refs/heads/main.zip)，解压后运行对应安装器。密码输入不会显示；密码错误或文件被修改时，认证解密会失败且不会安装。

## 解锁后可以做什么

- 拆解参考短视频的镜头、节奏、动作、声音与关键帧。
- 把小说、文章或大纲改写为格式化短视频剧本。
- 孵化原创治愈 IP，整理角色设定、三视图和服装规范。
- 生成分镜、首尾帧、多帧导入清单与连续性方案。
- 使用豆包 Seed Audio 生成配音、对白、环境声、字幕时间戳或合成音轨。
- 编写 Seedance 2.x、即梦/火山方舟、可灵 3、Higgsfield 等平台的视频提示词。
- 使用本地 Seedance 2.0 / 火山方舟控制台提交任务、查询状态并保存结果。
- 沉淀提示词、成片记录与复刻复盘，方便继续迭代。

## 加密包内的技能与工具

| 项目 | 用途 |
| --- | --- |
| `doubao-seed-audio` | 配音、对白、环境声、拟音、字幕时间戳与音轨合成 |
| `ip角色进阶角色设定` | 深化角色外貌、服装、声音与设定图规格 |
| `novel-to-screenplay` | 将小说或叙事文本改写为格式化剧本 |
| `prompt-assistant` | 把场景描述提纯为更适合视频生成的提示词 |
| `storyboard-production` | 生成、补齐或重做分镜，维持角色和镜头连续性 |
| `video-prompt-writing` | 编写 Seedance 2.x 与 Higgsfield Seedance 电影级提示词 |
| `导演剧本skill` | 按“文—资—视—剪”流程完成剧本、资产、分镜与声音设计 |
| `warm-original-ip-incubator` | 从模糊偏好孵化治愈系原创 IP 与系列内容 |
| `apps/jimeng-api-console` | 本地 Seedance 2.0 / 火山方舟视频生成控制台 |

## 平台与 CLI 入口

- [OpenAI Codex CLI](https://developers.openai.com/codex/cli/)；[Codex Skills](https://developers.openai.com/codex/skills/)；[AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [Git](https://git-scm.com/downloads)；[GitHub CLI](https://cli.github.com/)
- [Node.js](https://nodejs.org/en/download)；[FFmpeg](https://ffmpeg.org/download.html)；[Git LFS](https://git-lfs.com/)
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper)
- [火山引擎 CLI（ve）](https://www.volcengine.com/docs/83927/1184025)
- [火山方舟视频生成 API](https://api.volcengine.com/api-docs/view?action=CreateContentsGenerationsTasks&serviceCode=ark&version=2024-01-01)
- [可灵 AI](https://klingai.com/)；[Higgsfield](https://higgsfield.ai/)

## 公开内容与安全

- 公开仓库只含安装说明、安装器、加密核心包和 4 张范例图；不上传视频、音频或批量生成图片。
- 核心包使用 AES-256-GCM 认证加密，密钥由密码经 scrypt 派生；`SHA256SUMS` 用于检查下载完整性。
- API Key、AK/SK、Cookie、Token、CLI 登录态、`.env`、私钥和本机缓存均不进入仓库或加密包。
- 第三方平台凭据只能通过本机环境变量、用户级配置或平台 CLI profile 注入。
- 解密出的核心目录已被公开仓库的 `.gitignore` 忽略，避免误提交明文。

范例图包括 DORO（粉粉）、咕咕嘎嘎（小企）、Walulu，以及一张视频拆解联系表。完整媒体资产仍只保留在项目作者本机。

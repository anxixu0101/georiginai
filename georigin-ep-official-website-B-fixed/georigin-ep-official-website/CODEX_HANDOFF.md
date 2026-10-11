# EP 官网 B 方案：交接给 VSCode Codex

## 最新首页需求已实现

本页下方 B 方案为历史交接记录。2026-10-11 的最新附图需求已覆盖原首页方案：去除首页版本编号、首屏产品与订阅、左侧 9:16 原型演示和右侧说明、硬件及游戏进展。当前实现和验证范围见 `docs/HOMEPAGE_IMPLEMENTATION.md`。

## 后续本地检查（2026-10-11）

用户已明确本次只需本地预览。依赖安装、类型检查、构建及本地 HTTP 检查已通过；详细结果和未完成的浏览器验收见 `docs/LOCAL_PREVIEW.md`。外层目录新增 `预览网站.cmd`，可以双击启动。当前工具无可用浏览器会话，未做截图或真机验收；未提交真实邮箱，未部署。

这份项目已修改首页代码，基于原来的 React + TypeScript + Vite / Hono 项目。正式官网尚未部署或替换。

## 已完成

- 首页采用深蓝 `#101D30` + 白色下半页，取消旧首页的大量展示模块和重复底部 CTA。
- 首屏展示「One switch. A different way to play.」、产品一句话介绍和「EP 2.0 · Coming to Kickstarter」。
- 首页只有一处可见邮箱表单；其它更新入口滚动回同一个表单。
- 玩法视频使用 `q0WvfenTqc0`，点击真实 1280×720 缩略图后加载 YouTube 播放器，另有 YouTube 外链。Shorts 原视频的竖屏与侧边留白保留，不使用设计稿里的合成画面。
- 标明 EP 1.0 是已经能玩的原型、不出售、只是开始；EP 2.0 将完善现有 demos 并制作新游戏。
- EP 2.0 使用现有蓝色设计图，并标明「Design in development」，不将效果图当成已完成硬件。
- 保留原四个导航 SVG 和拨杆、雷达、铅笔、握手动画。调整为深蓝背景可见的配色，补手机菜单、Escape、键盘焦点、减少动画偏好。
- 首页开发日志从原 `POSTS` 读取最新两篇，改成简洁列表；原 5 篇 Markdown、日志列表、文章路由完整保留。
- 保留原 MailerLite 表单地址、官方脚本、成功回调与桥接模块，也保留 Plausible 脚本及原后端。
- 删除日志页「early-bird price」承诺，改为开发进度与 Kickstarter 上线通知。
- 游戏、日志、文章页改成按需加载；未重做旧游戏页面内容。
- 编写桌面/手机响应式样式，更新首页标题、描述与浏览器主题色。

布局参考：`docs/design-reference-B.png`。该图只用于审美、层级和留白参考；真实页面视频封面和 2.0 图的背景会与设计稿不同。

## 本次验证结果

2026-10-11，Node 24.19.0：

- `npm ci --no-audit --no-fund` 成功。
- `npm run check` 通过。
- `npm run build` 通过，前端输出 `dist/public`，后端输出 `dist/boot.js`。
- 修改的 TS/TSX 文件定向 ESLint 通过。
- 原 5 篇开发日志、MailerLite 桥接文件和 package-lock 均与上传版本逐字节一致。
- 新图片文件存在且可解码；真实视频缩略图尺寸为 1280×720，2.0 图尺寸为 1536×1024。
- 源码及 CSS 约束审查涵盖 320 / 390 / 768 / 1024 / 1440 px，未发现固定宽度导致的明显溢出。

没有进行浏览器截图、真实设备播放、真实邮箱提交、MailerLite 后台检查、Plausible 后台检查或正式部署。不能把上面的构建与源码检查当成浏览器验收。

## 本地打开

建议 Node 22.12+ 或 Node 24。

```sh
npm ci
npm run dev
```

开发服务默认端口为 3000，以终端输出为准。

ZIP 包不包含 `node_modules`、`dist` 或实际 `.env`；`.env.example` 仅含空配置项。正式环境的配置沿用你原项目自己的 `.env` 或部署平台变量，不从这份交付包推测。

若继续使用原 Node 生产服务：

```sh
npm run check
npm run build
npm start
```

原服务启动需要 `APP_ID`、`APP_SECRET`、`DATABASE_URL`。目前网页邮箱表单直接走 MailerLite，原 `/api/trpc.subscribe` 写入 MySQL，是另一个接口；不要用它替换 MailerLite 流程。前端静态托管则需要配置 SPA 回退，让 `/devlog` 和 `/devlog/YYYY-MM-DD` 刷新时能返回 index.html。

## VSCode Codex 需要接着做

1. **浏览器验收**：在 1440、1024、768、390、320 px 检查首屏、行距、表单、视频、2.0 图片、日志与页脚；确认无横向滚动。手机首屏能清楚看到产品说明、KS 状态和订阅入口。
2. **导航与无障碍**：验证四个图标 hover/focus 动画，手机菜单开关、Escape、Tab 循环、点击后滚动位置、从日志页返回首页锚点，以及系统「减少动画」设置。
3. **视频真机验证**：在 Safari/iOS 和 Chrome/Android 点击播放，检查声音、全屏与外链。视频依赖 YouTube，在该服务不可访问的网络中无法保证播放；目前外链作为备选。需要跨网络可用时，由项目方提供原视频文件并选择自托管方案。
4. **真实订阅验收**：用你自己的受控测试邮箱提交一次，确认 MailerLite 后台确实收到、分组正确、确认/欢迎邮件与退订链路正常。再测试无效邮箱、加载中、外部脚本不可用及超时错误。现有桥接等待官方成功回调，12 秒超时；脚本未接管或被拦截时可能走原生表单或报错。这是原接入的限制，未在本次改造中重写。
5. **正式部署**：按原项目现有托管方式部署，保留环境变量、域名、HTTPS 和路由回退，再检查刷新日志详情、图片访问与 Plausible 数据。
6. **KS 上线后**：目前没有提供真实 KS 项目链接和发布日期；页面没有编造它们。拿到链接后再加正确的 Kickstarter 入口，仍保留清晰的主 CTA。

## 直接发给 VSCode Codex 的指令

> 请以这份已修改项目为基础完成官网 B 方案。先阅读 CODEX_HANDOFF.md 和 docs/design-reference-B.png，保留现有框架、四个导航动画、全部开发日志、MailerLite 接入和正式环境配置。不要重新添加旧首页的复杂展示模块、重复订阅区、价格承诺或“Before the next chapter.”。首页深蓝为 #101D30，结构是首屏说明和邮箱、真实 1.0 视频、2.0 简介、开发日志。先在浏览器完成桌面和手机验收，修复实际发现的问题；用我提供的测试邮箱验证 MailerLite，再按原部署流程准备上线，并说明部署验证结果。

## 主要改动位置

- `src/pages/Home.tsx`：首页模块组成。
- `src/styles/landing.css`：B 配色、排版、响应式、导航与表单样式。
- `src/components/home/Hero.tsx`：首屏及唯一首页邮箱表单。
- `src/components/home/GameplayVideo.tsx`：真实视频封面、点击播放与外链。
- `src/components/home/PrototypeRoadmap.tsx`：简洁 2.0 介绍。
- `src/components/home/DevLogTeaser.tsx`：真实最新日志列表。
- `src/components/Navbar.tsx`：原图标、导航及手机交互。
- `src/components/SubscribeForm.tsx`：订阅 UI 状态和无障碍属性。
- `src/components/Layout.tsx`、`src/lib/lenis.ts`、`src/components/Reveal.tsx`：滚动与减少动画支持。
- `src/components/Footer.tsx`：首页简洁页脚，保留原社交地址。
- `src/App.tsx`：子页面按需加载。
- `src/pages/Devlog.tsx`：移除未经确定的价格承诺。
- `src/lib/site.ts`：指定玩法视频 ID/外链。
- `index.html`：标题、描述、主题色；订阅与统计脚本保留。
- `public/assets/ep-v1-gameplay.jpg`、`ep-v2-design.webp`：真实视频缩略图与已有 2.0 设计素材。

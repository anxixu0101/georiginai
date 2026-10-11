# 本地预览与验收记录

2026-10-11，本次范围按用户回复限定为本地预览。

## 打开网站

双击项目外层目录的 `预览网站.cmd`，然后在浏览器打开终端打印的 Local 地址。默认是 http://127.0.0.1:3000/；若端口已被占用，以终端实际输出为准。保留终端窗口，Ctrl+C 停止服务。

也可以在 PowerShell 执行：

```powershell
cd "E:\几何原点\公司官网\georigin-ep-official-website-B-fixed\georigin-ep-official-website"
npm.cmd ci --no-audit --no-fund
npm.cmd run dev -- --host 127.0.0.1
```

本次依赖已经安装，后续启动可跳过 `npm.cmd ci`。使用 `npm.cmd` 避免当前 PowerShell 的 npm.ps1 执行策略错误。本地前端预览不需要填写生产环境密钥。不要直接双击 index.html。

## 已验证

- Node v24.16.0，依赖安装成功。
- `npm.cmd run check` 通过。
- `npm.cmd run build` 通过，输出 dist/public 和 dist/boot.js。构建有 Browserslist 数据陈旧及大于 500 kB 的前端包提示，不影响构建成功。
- Vite 开发服务启动成功。
- HTTP 检查：首页、/games、/devlog、/devlog/2026-07-03 均返回 200 和 HTML；两张首页主要图片返回 200 和正确图片类型。此检查不证明 React 页面已在浏览器正确渲染。
- 已阅读交接文件、设计参考图及导航、响应式样式、锚点滚动、视频和订阅代码，保留现有 B 方案及 MailerLite 接入。

## 尚未完成的浏览器验收

当前自动化工具返回空浏览器列表，无可用浏览器会话，因此没有截图验收，也没有验证 1440 / 1024 / 768 / 390 / 320 px 的实际布局、横向溢出、菜单焦点循环、图标动画或减少动画设置。源码检查和 HTTP 成功不能替代这些验收。

可在浏览器 F12 的设备工具栏分别设置以上宽度，检查产品说明、Kickstarter 状态、唯一订阅入口、视频、2.0 图、日志及页脚。手机菜单需检查 Escape 关闭、Tab 与 Shift+Tab 循环，以及日志页返回首页锚点。YouTube 声音与全屏还需 Safari/iOS 和 Chrome/Android 真机测试。

本次未提交真实邮箱、未验证 MailerLite 后台及邮件链路、未部署正式官网、未检查 Plausible 后台。用户已明确本次只需本地预览。

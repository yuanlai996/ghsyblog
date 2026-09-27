# GHSY 手记 — 个人博客网站

一套完整的静态博客，已经按 `ghsy1.xyz` 配置好。没有数据库、没有后台程序，
上传即可访问，托管和 HTTPS 证书都免费。

---

## 一、目录结构

```
网页制作/
├─ index.html            首页（文章列表、搜索、标签筛选）
├─ about.html            关于页
├─ 404.html              找不到页面时显示的页面
├─ posts/                所有文章
│   ├─ static-site-deploy.html
│   ├─ hello-world.html
│   ├─ css-design-tokens.html
│   └─ reading-notes-2026.html
├─ templates/
│   └─ post-template.html  写新文章时复制这个文件
├─ assets/
│   ├─ css/style.css     全站样式
│   ├─ js/site.js        深浅色切换、搜索、筛选
│   ├─ favicon.svg       浏览器标签小图标
│   └─ logo.svg          站点图标
├─ feed.xml              RSS 订阅源
├─ sitemap.xml           给搜索引擎的站点地图
├─ robots.txt            爬虫规则
├─ CNAME                 内容为 ghsy1.xyz（GitHub Pages 需要）
├─ _headers              Cloudflare Pages / Netlify 的缓存与安全响应头
└─ .nojekyll             告诉 GitHub Pages 不要用 Jekyll 处理
```

---

## 二、本地预览（可选）

在项目文件夹里打开终端，执行下面任意一条，然后浏览器访问 <http://localhost:8080>：

```bash
python -m http.server 8080
```

> 直接双击 `index.html` 也能看，但用本地服务器打开更接近线上的真实效果。

---

## 三、部署上线（三选一）

### 方案 A：Cloudflare Pages（推荐）

优点：免费、国内访问相对稳定、自动签发并续期 HTTPS 证书、支持自动部署。

1. 注册 <https://dash.cloudflare.com>，在 **Workers & Pages** 里创建 Pages 项目。
2. 选择 **Connect to Git**（把本文件夹推到 GitHub 仓库后选它），
   或选择 **Direct Upload** 直接把整个文件夹拖进去。
3. 如果选择了 Git 方式，构建设置填：
   - Build command（构建命令）：**留空**
   - Build output directory（输出目录）：`/`
4. 发布后先访问平台分配的临时域名（形如 `xxx.pages.dev`），确认页面正常。
5. 添加自定义域名：
   - 把 `ghsy1.xyz` 接入 Cloudflare（在 **Add a site** 里按提示修改域名商处的 NS 记录）；
   - 进入 Pages 项目 → **Custom domains** → 添加 `ghsy1.xyz` 和 `www.ghsy1.xyz`。
   - 解析记录与证书会自动创建，无需手填。
6. 打开 **SSL/TLS → Edge Certificates → Always Use HTTPS**，让访问自动跳转到 https。

### 方案 B：GitHub Pages

优点：代码和网站放在一处，完全免费。

1. 在 GitHub 新建仓库（例如 `ghsy-blog`），把本文件夹所有文件推上去。
2. 仓库 **Settings → Pages**：Source 选 `Deploy from a branch`，
   Branch 选 `main`、目录选 `/ (root)`，保存。
3. 等 1～2 分钟后访问 `https://你的用户名.github.io/ghsy-blog/` 确认正常。
4. 在 **Settings → Pages → Custom domain** 里填 `ghsy1.xyz` 并保存
   （仓库里的 `CNAME` 文件内容也要是这一行，本模板已配置好）。
5. 到你的域名服务商后台添加下面的解析记录：

   | 类型 | 名称 | 值 |
   | --- | --- | --- |
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | 你的用户名.github.io |

6. 解析生效后回到 Pages 设置，勾选 **Enforce HTTPS**。

### 方案 C：Netlify / Vercel（最省事）

1. 注册后在后台找到部署入口，把整个文件夹拖进虚线框即可上线。
2. 在 **Domain settings** 里添加 `ghsy1.xyz`，按提示到域名商处添加
   它给出的 CNAME 或 A 记录；证书自动签发。

> 三个方案都不需要自己购买 SSL 证书。域名 `ghsy1.xyz` 本身需要每年续费，
> 请确保它没有过期。

---

## 四、上线后建议做三件事

1. 到 [Google Search Console](https://search.google.com/search-console) 提交
   `https://ghsy1.xyz/sitemap.xml`，让 Google 收录。
2. 到百度搜索资源平台同样提交站点地图。
3. 用手机打开一次站点，确认导航、深色模式都正常。

---

## 五、如何写一篇新文章

1. 复制 `templates/post-template.html` 到 `posts/` 文件夹，
   改成英文小写文件名，例如 `posts/my-first-trip.html`。
2. 用编辑器打开，全文替换模板里这 5 个占位符：
   `【文章标题】`、`【文章摘要】`、`【文章网址别名】`、`【发布日期】`、`【日期中文写法】`。
3. 在「正文开始 / 正文结束」之间写内容，可用的写法见模板里的示例
   （标题、段落、引用、列表、代码块、提示框、表格）。
4. 打开 `index.html`，复制任意一张 `<article class="card" ...>` 卡片，
   修改 `href`、`data-title`、`data-excerpt`、`data-tags` 和显示文字。
   > 卡片上的 `data-title`、`data-excerpt`、`data-tags` 决定站内搜索和标签筛选的结果，
   > 记得一起改。
5. 把新页面地址加进 `sitemap.xml` 和 `feed.xml`（照抄现有条目的格式）。
6. 重新部署：GitHub / Cloudflare Pages 会自动检测提交并更新；
   拖拽上传的方式则重新上传一次。

---

## 六、想改外观时改哪里

全站的颜色、字号、圆角都集中在 `assets/css/style.css` 顶部的 `:root` 里，
改一处即全站生效：

```css
:root {
  --accent: #c2410c;   /* 主色调（按钮、链接、标签） */
  --bg: #faf8f5;       /* 页面底色 */
  --text: #1b1917;     /* 正文颜色 */
  --radius: 16px;      /* 卡片圆角 */
}
```

深色模式的颜色在同文件的 `:root[data-theme="dark"]` 里，对应着改即可。

---

## 七、需要替换成你自己的内容

- [ ] `about.html` 里的自我介绍、邮箱 `hello@ghsy1.xyz`（改成你实际使用的邮箱）
- [ ] 4 篇示例文章（可留作参考，也可删掉换成自己的）
- [ ] `feed.xml`、`sitemap.xml` 里的文章列表
- [ ] 页脚的版权署名

站点名称如果也要改，需要同时替换以下文件里的「GHSY 手记」：
`index.html`、`about.html`、`404.html`、`posts/` 下的所有文章、`feed.xml`。

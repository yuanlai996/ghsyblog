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
├─ .nojekyll             告诉 GitHub Pages 不要用 Jekyll 处理
└─ README.md             就是本文件，部署步骤都写在这里
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

> 注意：Cloudflare Pages 要求把域名的 DNS 解析从原来的服务商搬到 Cloudflare。
> 如果你的域名解析在阿里云、又想继续留在阿里云，请直接看 **方案 B：GitHub Pages**。

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
5. 到你的域名服务商后台添加下面的解析记录（在阿里云填写的具体位置见下一节）：

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

## 四、域名解析怎么填（以阿里云为例）

解析只做一件事：告诉浏览器「`ghsy1.xyz` 这台服务器在哪里」。
如果你的域名解析托管在阿里云，按下面这节操作即可。
用腾讯云、华为云等其他服务商也是同样的填法，只是按钮位置不同。

> 需要 Cloudflare 吗？只有选了「方案 A：Cloudflare Pages」才需要把域名接入 Cloudflare。
> 用 GitHub Pages + 阿里云解析同样可行，完全不需要 Cloudflare。
> 阿里云云解析的**免费版够用**，不需要升级到付费版。

### 1. 添加这五条记录

登录阿里云 → 搜索进入 **云解析 DNS** → 找到 `ghsy1.xyz` → 点「解析设置」→「添加记录」：

| 记录类型 | 主机记录 | 记录值 | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | 默认（10 分钟） |
| A | @ | 185.199.109.153 | 默认（10 分钟） |
| A | @ | 185.199.110.153 | 默认（10 分钟） |
| A | @ | 185.199.111.153 | 默认（10 分钟） |
| CNAME | www | 你的用户名.github.io | 默认（10 分钟） |

四条 A 记录让 `ghsy1.xyz` 能打开，那条 CNAME 让 `www.ghsy1.xyz` 也能打开。
TTL 保持默认即可，它的意思是「这份记录在各处缓存多久」。

### 2. 三个容易填错的地方

- **主机记录填 `@`**，不要填完整域名。填成 `ghsy1.xyz` 会变成
  `ghsy1.xyz.ghsy1.xyz` 这种不存在的地址。`@` 就代表主域名本身。
- **不要用「URL 转发」类的记录**。GitHub Pages 只认 A 和 CNAME 两种记录。
- **记录值不要带 `https://` 或结尾的斜杠**，直接填 IP 或域名。

### 3. 加完记录却没反应？先查这一项

确认域名的 **DNS 服务器**是否指向阿里云的 `ns1.alidns.com` 和 `ns2.alidns.com`
（在云解析 DNS 的域名列表里可以看到）。如果域名在别处注册、又没有把 DNS 服务器改到阿里云，
那么在阿里云添加的记录不会生效。

### 4. 关于国内访问速度

解析服务只负责「指路」，网站文件实际存放在 GitHub 的服务器上。
所以把解析放在阿里云不会让网站变快，国内访问 GitHub Pages 仍然可能比较慢。

想提速只有两条路：换到 Cloudflare Pages（改善有限），
或者用阿里云自己的对象存储加 CDN（速度快很多，但**绑定域名需要先完成 ICP 备案**）。
GitHub Pages 的优势正是不需要备案，建议先用起来，速度真的成为问题时再折腾。

---

## 五、上线后建议做三件事

1. 到 [Google Search Console](https://search.google.com/search-console) 提交
   `https://ghsy1.xyz/sitemap.xml`，让 Google 收录。
2. 到百度搜索资源平台同样提交站点地图。
3. 用手机打开一次站点，确认导航、深色模式都正常。

---

## 六、如何写一篇新文章

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

## 七、想改外观时改哪里

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

## 八、需要替换成你自己的内容

- [ ] `about.html` 里的自我介绍、邮箱 `hello@ghsy1.xyz`（改成你实际使用的邮箱）
- [ ] 4 篇示例文章（可留作参考，也可删掉换成自己的）
- [ ] `feed.xml`、`sitemap.xml` 里的文章列表
- [ ] 页脚的版权署名

站点名称如果也要改，需要同时替换以下文件里的「GHSY 手记」：
`index.html`、`about.html`、`404.html`、`posts/` 下的所有文章、`feed.xml`。

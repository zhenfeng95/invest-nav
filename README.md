# Investment Navigation / 投资导航

美股、加密货币、跨境出海一站式投资导航网站。

这个项目不是交易软件，也不是实时行情软件。第一阶段的目标是把产品骨架、页面、组件、数据层和 Cloudflare Workers 部署配置先跑通。

## 技术栈

- Nuxt 3
- Vue 3
- TypeScript
- Nitro
- Tailwind CSS
- Cloudflare Workers
- Wrangler

当前部署方案使用 Nitro 官方推荐的 `cloudflare_module` preset，而不是过时的 Cloudflare Pages 配置。

## 目录结构

```text
.
├── assets/css/            # 全局样式
├── components/            # 布局、首页、教程、工具、导航组件
├── composables/           # SEO 等组合式函数
├── data/                  # JSON 数据，与 UI 解耦
│   ├── tutorials.json
│   ├── tools.json
│   └── navigation.json
├── layouts/
├── pages/
├── public/
├── server/api/            # Mock API 预留
├── types/
├── utils/                 # 数据读取层
├── nuxt.config.ts
├── wrangler.jsonc
└── README.md
```

## 常用命令

```bash
npm install
npm run dev
npm run build
npx wrangler deploy
```

当前 Nuxt / Nitro 生成 Workers 配置后，更稳妥的部署命令是：

```bash
npx wrangler --cwd .output deploy
```

## 安装

```bash
npm install
```

## 本地运行

```bash
cp .env.example .env
npm run dev
```

浏览器访问：

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

构建产物在 `.output/`。Cloudflare Workers 会使用：

- `.output/server/index.mjs`
- `.output/public/`

## 环境变量

复制 `.env.example` 为 `.env`。当前只有公开站点地址：

```bash
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

生产环境请改成你的 Workers 域名或自定义域名。该变量用于 canonical、Open Graph、sitemap 和 robots.txt。

不要把 API Key、Token、Secret 或 Password 放进 Git。`.env`、`.dev.vars` 和 `.wrangler` 已被忽略。

## Cloudflare 部署

本项目按当前 Nuxt / Nitro 推荐方式部署到 **Cloudflare Workers**：

1. `nuxt.config.ts` 中设置 `nitro.preset = 'cloudflare_module'`
2. `wrangler.jsonc` 指向 Nitro 输出目录
3. 使用 Wrangler 4 进行部署

### Wrangler 使用方式

先登录 Cloudflare：

```bash
npx wrangler login
```

然后构建并部署。当前 Nuxt / Nitro 会在 `.output` 里生成 Workers 配置，因此部署命令为：

```bash
npm run build
npx wrangler --cwd .output deploy
```

或一次执行：

```bash
npm run deploy
```

本地预览 Workers 产物：

```bash
npm run build
npm run cf:dev
```

如果当前环境还没有登录 Cloudflare，项目本身仍可本地开发和构建。只是 `wrangler deploy` 需要你在自己的机器上完成授权。

### 自定义域名

部署成功后，在 Cloudflare Dashboard 的 Workers 项目里绑定自定义域名：

1. 打开 Workers & Pages
2. 进入 `invest-nav`
3. Settings → Domains & Routes
4. 添加你的域名

同时把 `NUXT_PUBLIC_SITE_URL` 改成该域名后重新部署。

## 数据文件如何维护

第一阶段所有业务数据都在 `data/`：

- `data/tutorials.json`：教程
- `data/tools.json`：工具入口与状态
- `data/navigation.json`：导航分类和资源

页面不要直接写死业务数据。请通过 `utils/tutorials.ts`、`utils/tools.ts`、`utils/navigation.ts` 读取。

不确定的官方链接请保持 `officialUrlConfirmed: false`，不要伪造官网地址。

## 未来如何扩展

- 把 JSON 换成 Markdown / CMS / Cloudflare D1 / MySQL / API 时，只改 `utils/` 数据层
- `server/api/` 已预留 `market`、`portfolio`、`calendar`、`qdii`、`crypto`
- 工具页目前是 Coming Soon，后续可在不改路由的前提下接入真实逻辑
- 不要在第一阶段加入用户系统、支付、实时行情或真实交易接口

## 收盘日报

投研 Agent 仓库里每个工作日生成的 Markdown 日报，可以通过 GitHub API 在本站 `/reports` 展示，无需把文件复制进这个仓库。

在 `.env` 中填写：

```bash
NUXT_GITHUB_REPORTS_OWNER=your-github-user
NUXT_GITHUB_REPORTS_REPO=your-agent-repo
NUXT_GITHUB_REPORTS_PATH=output/daily
NUXT_GITHUB_REPORTS_REF=main
NUXT_GITHUB_TOKEN=github_pat_xxx
```

`NUXT_GITHUB_REPORTS_PATH` 是日报 md 所在目录。文件名建议包含日期，例如 `2026-08-17.md`。私有仓库必须提供 Token；公开仓库也建议配置，以避免 GitHub API 限额。生产环境请用 Wrangler secret 注入 `NUXT_GITHUB_TOKEN`，不要提交到 Git。

## 主要路由

- `/`
- `/reports`
- `/reports/:date`
- `/tutorials`
- `/tutorials/articles`
- `/tutorials/videos`
- `/tutorials/infographics`
- `/tools`
- `/nav`
- `/nav/stocks`
- `/nav/crypto`
- `/nav/funds`
- `/nav/etf`
- `/nav/stocks-cn`
- `/nav/options`
- `/nav/hk-banks`
- `/nav/us-brokers`
- `/nav/fund-transfer`
- `/nav/deposit-withdraw`
- `/about`

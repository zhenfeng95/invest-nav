export const dnsheFreeDomainGuide = `本页整理 **DNSHE** 免费域名注册与 DNS 解析的定位、开放后缀、控制台用法、续期规则与 API 注意点，仅供信息对照。开放后缀、配额、有效期、审核与解析能力会变化，请以 [DNSHE 官网](https://www.dnshe.com) 与 [客户中心](https://my.dnshe.com) 当时显示为准。本页不构成注册、建站或合规建议。

DNSHE 面向开发者、学生、开源项目和早期创作者，提供**无需信用卡**的免费域名与托管 DNS。它解决的是「先有一个能解析的网络入口」，不是「买下一枚可独立转移的 \`.com\` 资产」。若你要长期持有品牌域名，仍应对照站内 [Google Workspace 低价 .com 教程](/tutorials/google-workspace-domain-guide) 或 [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)。

## 一、DNSHE 是什么

公开介绍里，DNSHE 提供：

- 其运营后缀下的**免费二级域名**注册（例如 \`yourname.de5.net\`）
- 控制台里的完整 DNS 记录管理
- 面向脚本、CI/CD、测试环境和证书自动化的 REST API
- 基础 DNS 防护，以及部分场景下的 DNSSEC 支持

官网强调基础域名服务永久免费、无隐藏收费。需要同时记住边界：

- 你拿到的是 DNSHE **运营后缀下的子域名**，所有权、续期和解析都依赖该平台，不能像 \`.com\` 那样按 ICANN 规则转到任意注册商。
- 免费服务可按资源、风控和合规需要设置数量、后缀、审核或限速；违规或滥用可能导致解析被删、域名暂停或账户受限。
- 「永久免费」指**不收年费**，不等于「注册后可以完全不管」。自 **2026 年 1 月 1 日**起，新注册免费域名默认有效期 1 年，到期前需主动免费续期。

## 二、开放后缀（介绍列表）

官网当前重点展示的后缀如下。登录控制台后可能看到更多可用后缀，以当时列表为准。

| 后缀 | 官网推荐场景 | 备注 |
| --- | --- | --- |
| \`.de5.net\` | 技术博客、作品集、演示站、开源项目 | 较短，偏开发者 |
| \`.us.ci\` | CI/CD、SaaS、API 端点、测试环境 | 偏自动化与持续集成 |
| \`.cc.cd\` | 个人品牌、设计工作室、创意项目 | 偏公开展示 |
| \`.bot.cd\` | AI Bot、聊天助手、Webhook、自动化 | 偏机器人与回调地址 |

完整主机名形态是 **\`前缀.后缀\`**，例如 \`blog.de5.net\`、\`api.us.ci\`。前缀需未被占用，且须遵守平台命名与滥用规则。

部分后缀已加入或申请加入 [Public Suffix List](https://publicsuffix.org/)（PSL）。加入 PSL 后，浏览器会把 \`a.de5.net\` 和 \`b.de5.net\` 视为不同站点，降低 Cookie 跨站共享风险。是否已生效以 PSL 当时列表为准。

## 三、适合谁 / 不适合谁

**更可能适合**

- 个人博客、作品集、Demo、Webhook、测试环境，需要立刻有一个可解析的名字
- 不想先付 \`.com\` 年费，也不想绑定信用卡
- 需要 API / DDNS，把解析接到部署流水线或动态 IP

**更可能不适合**

- 要做长期品牌、对外商务邮箱、独立转移注册商
- 站点主要面向中国大陆且需要备案（这类免费后缀通常帮不上备案）
- 把重要生产流量、资金相关回调完全押在免费公益服务上

## 四、注册与解析（使用列表）

界面文案会改版，以下为常见步骤摘要，请以控制台为准。

### 1. 创建账户

1. 打开 [DNSHE 官网](https://www.dnshe.com) 或 [客户中心注册页](https://my.dnshe.com/register.php)

![DNSHE 官网：右上角 Login / Sign Up 入口](/images/tutorials/dnshe-signup.png)

2. 完成登录或注册。可用邮箱密码，也可以点 **「使用 GitHub 登录」** / **「使用 Google 登录」** 授权进入（本页示例走的是 GitHub）

![DNSHE 登录页：可选用 GitHub 授权登录](/images/tutorials/dnshe-github-login.jpg)

3. 登录后进入域名管理：点左侧菜单 **「免费域名」**，或用户中心欢迎区的 **「注册新域名」**，都会进入 [Domain Hub / 免费域名管理](https://my.dnshe.com/index.php?m=domain_hub)

![DNSHE 用户中心：左侧「免费域名」或「注册新域名」进入管理页](/images/tutorials/dnshe-dashboard-free-domain.jpg)

无论用邮箱还是第三方授权，账户绑定的联系邮箱建议保持可收信：续期提醒、审核和滥用通知通常发到这里。

### 2. 搜索并注册前缀

1. 在免费域名管理页查看 **注册额度**，点 **「+ 注册新域名」**（也可点「邀请好友解锁额度」增加配额）

![DNSHE：注册额度与「+ 注册新域名」](/images/tutorials/dnshe-register-quota.png)

2. 在弹窗里 **选择根域名**（如 \`de5.net\`），填写 **域名前缀**（2–36 位，仅字母、数字和连字符 \`-\`）

![DNSHE：注册新域名弹窗，选择根域名并输入前缀](/images/tutorials/dnshe-register-modal.png)

3. 核对 **完整域名预览**；显示「此域名可注册」后，点 **「确认注册」**。页面会提示：注册成功后需手动设置 DNS 解析

![DNSHE：预览完整域名并确认可注册后提交](/images/tutorials/dnshe-register-available.png)

4. 注册成功后，域名会出现在「我注册的域名」列表中，可点 **「管理域名」** 继续配置

可注册数量、是否需要审核，以控制台配额和提示为准。不要用脚本批量抢注——这属于平台明确限制的滥用行为。

### 3. 托管域名到 Cloudflare

1. 复制刚在 DNSHE 注册好的完整域名（如 \`inve.de5.net\`），打开 [Cloudflare](https://www.cloudflare.com) 并登录。左侧进入 **「域名」→「概览」**，点右上角 **「添加域名」**

![Cloudflare：域名概览页点击「添加域名」](/images/tutorials/dnshe-cloudflare-add-domain.png)

2. 在「添加站点」页选择 **「连接域名」**（把已有域名接到 Cloudflare；不要选「转移域名」或「购买域名」，除非你另有需要）。

![Cloudflare：添加站点页点击「连接域名」](/images/tutorials/google-workspace-cloudflare-connect-domain.png)

3. 在「连接您的域名」页输入刚才注册的域名，继续下一步。

![Cloudflare：输入刚注册的域名](/images/tutorials/dnshe-cloudflare-enter-domain.png)

4. 计划选择 **「免费」**（US$0）即可，点击 **「选择计划」**。

![Cloudflare：选择免费计划](/images/tutorials/google-workspace-cloudflare-free-plan.png)

5. 进入「查看您的 DNS 记录」页后往下滑。新域名常见会显示「找到的记录：0」，先不用急着补全；滑到底部点 **「继续前往激活」**。

![Cloudflare：DNS 记录页点击「继续前往激活」](/images/tutorials/dnshe-cloudflare-dns-continue.png)

6. 接着 Cloudflare 会分配给你两个名称服务器（Nameserver）地址（每人/每域可能不同，以页面显示为准），复制下来备用。

![Cloudflare：复制分配的两个 Nameserver](/images/tutorials/google-workspace-cloudflare-nameservers.png)

7. **先不要关闭** Cloudflare 这个页面。另开标签页回到 DNSHE 免费域名管理，在「我注册的域名」列表里点对应域名的 **「管理域名」**。

![DNSHE：点击「管理域名」](/images/tutorials/dnshe-manage-domain.png)

8. 进入域名详情后，点 **「DNS服务器」**。在弹窗「DNS服务器（域名委派）」里，把默认的 \`ns1.dnshe.com\` / \`ns2.dnshe.com\` 换成刚才从 Cloudflare 复制的两个 Nameserver（每行一个），再点 **「保存设置」**。

![DNSHE：域名详情页点击「DNS服务器」](/images/tutorials/dnshe-dns-servers-button.png)

![DNSHE：粘贴 Cloudflare Nameserver 并保存](/images/tutorials/dnshe-dns-servers-modal.png)

9. 回到 Cloudflare，向下滚动页面，点击 **「我已更新名称服务器」**，让 Cloudflare 开始核验你在 DNSHE 侧的 NS 更改。

![Cloudflare：点击「我已更新名称服务器」](/images/tutorials/google-workspace-cloudflare-updated-ns.png)

10. 等待几分钟后，核验通过后，概述页会出现类似 **「您的域现在受 Cloudflare 保护」** 的提示，说明托管成功。

![Cloudflare：域名已生效并受保护](/images/tutorials/google-workspace-cloudflare-protected.png)

### 4. 在 Cloudflare 添加 DNS 记录

Nameserver 已改成 Cloudflare 并核验通过后，**解析以 Cloudflare 为准**。之后请到 Cloudflare 该域名的 **DNS → 记录** 里增删改，不要再指望 DNSHE 自带的「DNS 解析」面板生效（DNSHE 侧此时主要负责域名持有、续期与 NS 委派）。

常见记录类型：

| 类型 | 典型用途 | 示例 |
| --- | --- | --- |
| A | 指向 IPv4 服务器 | \`@\` 或主机名 → \`192.0.2.1\` |
| AAAA | 指向 IPv6 | 主机名 → IPv6 地址 |
| CNAME | 别名到另一主机名 | \`www\` → 根域名本身或其他主机 |
| MX | 收信 | 邮件服务商提供的 MX 主机 |
| TXT | 所有权验证、SPF、证书申请 | Let's Encrypt / 邮箱验证 |
| SRV / CAA | 服务发现、证书授权 | 按目标服务说明填写 |

典型建站最小集合：

1. 名称填 \`@\`（或留空）添加 **A** 记录，内容填服务器公网 IP
2. 如需 \`www\`，再加一条 **CNAME**，指向该域名本身（或同样指向站点）
3. 若申请 TLS 证书，按证书商要求加 **TXT** 验证记录

**代理开关**：Cloudflare 的橙色云是「已代理」（流量走 CDN），灰色云是「仅 DNS」。刚接上站点、或还没配好源站 SSL 时，可先用灰色「仅 DNS」确认解析通了，再按需打开代理。

改完记录后若未立刻生效，等几分钟再用 \`dig\` 或在线 DNS 查询核对。域名续期仍在 DNSHE 完成；动态 IP 若要用 DNSHE 的 DDNS，需域名仍使用 DNSHE 自家 NS——已委派到 Cloudflare 后，请改用 Cloudflare API 或其他 DDNS 方案。

### 5. 免费续期

据 [DNSHE 公告](https://my.dnshe.com/announcements/6/DNSHE-Free-Domain-Registration-Duration-Adjustment-Notice-Introduction-of-an-Annual-Registration-System.html?language=chinese)：

- **2026 年 1 月 1 日起**新注册的免费域名，默认有效期 **1 年**
- 到期前 **180 天**内可免费续期，续期次数不设上限
- 续期本身不收费；前提是域名保持正常、真实使用，且未处于异常/违规状态
- **2026 年 1 月 1 日前**已注册的域名，公告称不改为按年注册

控制台操作：进入免费域名面板，在到期窗口内点击域名旁的「免费续期」，确认新的到期时间。多个域名也可改用 API 批量续期。

建议在日历里标一次提醒，不要等到最后一天。

## 五、API 怎么用（摘要）

适合已经能在控制台完成注册、只想把列表、改记录、续期自动化的人。密钥不要写进公开仓库。

### 1. 准备密钥

1. 登录客户中心，打开免费域名管理
2. 左侧进入 **API 管理**
3. 创建 API 密钥，保存 \`X-API-Key\` 与 \`X-API-Secret\`

认证只放在 HTTP 请求头。官方文档说明：\`api_key\` / \`api_secret\` 不再允许出现在 URL 或请求体里。

当前客户中心 [API v2.0 文档](https://my.dnshe.com/knowledgebase/13/DNSHE%E5%85%8D%E8%B4%B9%E5%9F%9F%E5%90%8DAPI%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3V2.0.html?language=chinese) 使用的基址是：

\`https://api005.dnshe.com/index.php?m=domain_hub\`

官网营销页另有 \`https://api.dnshe.com/v2\` 示例。写脚本前以**客户中心文档当时地址**为准。默认速率限制常见为约 **30 次/分钟**。

### 2. 常用动作

列出自己的域名：

\`\`\`bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \\
  -H "X-API-Key: 你的Key" \\
  -H "X-API-Secret: 你的Secret"
\`\`\`

给已有域名加一条 A 记录（\`subdomain_id\` 换成列表接口返回的 id；IP 换成你的服务器地址）：

\`\`\`bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=create" \\
  -H "X-API-Key: 你的Key" \\
  -H "X-API-Secret: 你的Secret" \\
  -H "Content-Type: application/json" \\
  -d '{"subdomain_id":1,"type":"A","content":"192.0.2.1","ttl":600}'
\`\`\`

免费续期（需已进入到期前 180 天窗口）：

\`\`\`bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \\
  -H "X-API-Key: 你的Key" \\
  -H "X-API-Secret: 你的Secret" \\
  -H "Content-Type: application/json" \\
  -d '{"subdomain_id":1}'
\`\`\`

成功时返回里 \`success\` 应为 \`true\`，并带上新的 \`new_expires_at\`。若提示尚未进入续期窗口、余额不足或域名异常，按返回码对照官方文档，不要反复重试以免触发限速。

完整端点（注册、删除、改记录、配额、WHOIS）以客户中心文档为准，本页不展开全部参数。

## 六、和 \`.com\` / Cloudflare 怎么选

| 需求 | 更常见的选择 | 原因 |
| --- | --- | --- |
| Demo、测试、Webhook、练手 | DNSHE 免费后缀 | 零成本、立刻能解析 |
| 长期品牌、可转移、对外商务 | \`.com\` 等正规顶级域 | 资产独立于单一免费平台 |
| 低价长期持有 \`.com\` | [Workspace 土耳其区路径](/tutorials/google-workspace-domain-guide) | 社区反馈续费可低至约 ₺75/年，以结账页为准 |
| 透明成本价续费 | Cloudflare Registrar | 流程简单，少折腾区域定价 |
| CDN / 代理 / 证书 | Cloudflare | DNSHE 负责名字，站点加速仍可另接 Cloudflare |

也可以组合：用 DNSHE 做测试入口，正式产品再迁到自己的 \`.com\`。

## 七、风险与边界

- **不是可独立转移的顶级域资产**：平台调整后缀、配额或停服时，你无法按常规转移流程把名字带走。
- **续期是使用义务**：新域名按年有效；过期未续可能导致失效。公告称违规、闲置或滥用可能被限制续期。
- **滥用红线**：恶意软件、钓鱼、垃圾邮件、攻击流量、批量抢注、转售免费额度等，均在 [服务条款](https://www.dnshe.com/tos.html) 禁止范围内。
- **免费服务无现金价值**：条款写明免费额度不能折现、转让或据此索赔。
- **解析与证书**：把 NS 改到其他 DNS 商、或关闭平台 DNS 管理时，部分记录类型可能不可写。改完记录后用 \`dig\` 或在线查询核对。
- **大陆访问与备案**：免费海外后缀不解决备案、阻断或解析污染问题。

## 八、相关入口

- [DNSHE 官网](https://www.dnshe.com)
- [客户中心 / 注册](https://my.dnshe.com/register.php)
- [Domain Hub](https://my.dnshe.com/index.php?m=domain_hub)
- [免费域名 API v2.0](https://my.dnshe.com/knowledgebase/13/DNSHE%E5%85%8D%E8%B4%B9%E5%9F%9F%E5%90%8DAPI%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3V2.0.html?language=chinese)
- [续期说明](https://my.dnshe.com/knowledgebase/5/DNSHE-Free-Domain-Renewal-and-API-Command-Renewal-Methods.html?language=chinese)
- [服务条款](https://www.dnshe.com/tos.html)
- [滥用举报](https://www.dnshe.com/domainabuse/)
- 站内：[跨境数字基建导航](/nav/digital-infra)
- 站内：[Google Workspace 低价 .com 教程](/tutorials/google-workspace-domain-guide)

产品规则可能随时调整。注册、解析和续期前请以官方控制台与文档为准。

---

相关入口：[DNSHE](https://www.dnshe.com) · [数字基建导航](/nav/digital-infra)
`;

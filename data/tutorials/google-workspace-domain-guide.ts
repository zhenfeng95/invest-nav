export const googleWorkspaceDomainGuide = `本页整理通过 **Google Workspace** 区域定价通道，以土耳其里拉（TRY）计价注册 \`.com\` 等顶级域名的常见流程与注意点，仅供信息对照。价格、可用后缀、结算货币、试用规则、风控与域名注册商归属会变化，请以 [Google Workspace](https://workspace.google.com) 与结账页当时显示为准。本页不构成购买、税务或合规建议。

## 一、这条路径在解决什么问题

很多注册商会用「首年特价、次年涨价」卖域名：首年看起来便宜，续费常回到十几美元甚至更高。对需要长期持有 \`.com\` 的人来说，真正要看的是**续费价**。

公开分享与社区反馈中，有一条路径被反复提到：在 **Google Workspace 土耳其区 / TRY 结算** 流程里购买自定义域名时，部分 \`.com\` / \`.net\` / \`.org\` 等后缀会出现约 **₺75 / 年** 的报价；按近年汇率粗算大约 **10–11 元人民币/年**。也有人反馈续费仍按 ₺75 扣款——但这是社区实测信息，**不是 Google 对所有人、所有时刻的保证**，下单前务必自己看结账页。

可以把整件事理解成：

**用 Workspace 开通流程买域名 → 不需要就取消 Workspace 订阅 → 只保留域名年费**

域名本身仍是正规顶级域名资产；便宜的是区域定价下的结算货币，而不是「非正规域名」。

## 二、价格对比（帮助建立数量级）

下表是粗对比，方便理解数量级，**不是实时报价**：

| 渠道 | 常见首年体感 | 常见续费体感 | 备注 |
| --- | --- | --- | --- |
| Google Workspace（TRY 结算，部分后缀） | 约 ₺75（约 ¥10–11） | 社区反馈续费同价 | 以结账页为准；政策可能调整 |
| Cloudflare Registrar | 约 \$10+ | 约 \$10+ | 按成本价风格，稳定透明 |
| Namecheap 等促销渠道 | 首年常有折扣 | 次年常明显上涨 | 适合短期试项目 |
| 国内云厂商 | 首年活动价常见 | 续费常回到更高价 | 另有实名等要求 |

若你更在意流程简单、少折腾，Cloudflare Registrar 通常更省心；若你能接受区域结算与账号风控成本，再考虑 Workspace 这条低价路径。

## 三、开始前准备什么

1. **Google 账号**
   建议用专门账号，不要直接拿绑定重要资产的主号去试。建议提前开启两步验证，并绑定可靠的恢复方式。

2. **可支付外币的银行卡**
   需能完成 Google / 域名结账扣款。社区里较常见的反馈是：**实体 Visa / Mastercard 成功率更高**；部分虚拟卡更容易触发额外核验或失败。卡内预留小额可用额度即可（具体扣款以结账为准）。

3. **结算地区与网络环境要一致**
   目标是让开通流程进入 **土耳其 / TRY** 计价。若结账页显示美元或其他货币，说明区域定价未生效，应停止下单，先核对地区与网络环境，再重试。本站不提供绕过风控的操作指导。

4. **接码手机号**
   注册或验证时可能需要短信验证；\`+86\` 号码在部分流程里可用，以当时页面为准。

5. **心理预期**
   Google 可能对支付方式、地址信息、账号信誉做风控。出现额外核验、拒绝绑卡或要求补充材料时，属于常见情况，不一定是「域名本身有问题」。

## 四、注册与购域大致流程

以下为常见步骤摘要，界面文案会改版，请以官网为准。

### 1. 进入 Workspace 试用开通

访问 [Google Workspace](https://workspace.google.com)，开始免费试用（常见为约 14 天试用，以当时说明为准）。公司规模可按个人/一人团队选择。

![Google Workspace：点击「开始免费试用」](/images/tutorials/google-workspace-start-trial.png)

若浏览器里**已经登录**个人 Google 账号，系统常会先进入「开始注册」页，并提示用新账号重新开始。此时请点击 **「创建新账号」**，不要直接沿用当前个人账号往下走。若**尚未登录**，一般会直接进入创建表单页，按提示填写即可。

![Google Workspace：已登录时点击「创建新账号」](/images/tutorials/google-workspace-create-account.png)

进入「我们开始吧」表单后，按页面填写：

- **公司名称**：自行填写即可（可用英文简称）
- **员工人数**：个人使用选 **「只有您一人」**
- **区域**：选择 **土耳其**，以便后续以 TRY 计价（社区反馈该区域域名报价通常更低；区域一旦确认一般不可更改）

![Google Workspace：填写公司名称、人数并选择土耳其](/images/tutorials/google-workspace-business-info.png)

关键核对点：

- 业务地区 / 账单地区与 **土耳其** 相关选项一致
- 后续金额以 **TRY** 显示

接下来填写联系信息。姓氏、名字用英文即可，当前流程通常**没有实名核验**，可按习惯填写；但 **「当前电子邮件地址」务必使用真实、可收信的邮箱**——它会作为备用邮箱，用于接收验证码、账单与安全通知，务必确保你能联系到这个地址。

![Google Workspace：填写英文姓名与真实备用邮箱](/images/tutorials/google-workspace-contact-info.png)

### 2. 选择「需要新域名」

当流程问到业务是否已有域名时，选择需要新域名（文案常见类似 *No, I need one* / 「购买新域名」/ 获取新的自定义域名）。

![Google Workspace：选择「购买新域名」](/images/tutorials/google-workspace-buy-domain.png)

进入「为您的企业找一个域名」页后，在搜索框输入你想要的域名（可用公司名或品牌试搜），下方会出现可购买域名列表与价格。

![Google Workspace：搜索并选择可购买域名](/images/tutorials/google-workspace-search-domain.png)

挑选 **未注册且标价约 ₺75 / 年**（TRY）的 \`.com\` 或其他当时标价较低的后缀再继续；若列表价格明显是美元价，不要硬买。点选可用域名后进入下一步。

确认好你的域名（页面会显示「可购买」与年费），然后点击 **「下一步」**。

![Google Workspace：确认域名可购买后点击「下一步」](/images/tutorials/google-workspace-confirm-domain.png)

### 3. 填写联系与账单信息

进入「输入企业信息」页后，账单地址需与 TRY 结算地区匹配。可借助 [土耳其地址生成器](https://www.meiguodizhi.com/tr-address) 随便生成一组土耳其地址，填入街道、邮编、区、省与电话等字段；建议开启「将我的联系信息设为不公开」，填完后点击 **「下一步」**。

![Google Workspace：填写土耳其企业地址后点击「下一步」](/images/tutorials/google-workspace-business-address.png)

接着创建用户名：该用户名会作为域名邮箱的前缀。设置密码（不少于 8 个字符），下方两个营销类勾选项可不勾选，然后点击 **「同意并继续」**。

![Google Workspace：创建用户名并点击「同意并继续」](/images/tutorials/google-workspace-create-username.png)

页面会展示 Workspace 套餐（常见为「标准版」）：含每人约 **2 TB** 网盘、企业邮箱、Gemini 工作版等；示意标价约 **₺170.80 / 用户 / 月**（以当时页面为准）。点击 **「开始试用」** 即可进入结账；若你只想买域名、不需要 Workspace，试用开通后可在后文步骤里关闭席位订阅。

![Google Workspace：确认标准版套餐后点击「开始试用」](/images/tutorials/google-workspace-plan-trial.png)

### 4. 绑定支付方式并完成域名购买

进入「查看信息并结账」后，订单摘要通常会拆成两笔费用，先核对清楚再绑卡付款：

- **商务标准版（Workspace 席位）**：试用期内今天应付多为 **₺0**；约 **14 天试用结束后** 才开始按月扣费（示意约 ₺170.80 / 用户 / 月，以页面为准），可随时取消。
- **域名注册**：今天就要扣的费用，常见约 **₺75 / 年**（另加税费以结账页为准）。

![Google Workspace：结账页核对席位试用与域名年费](/images/tutorials/google-workspace-checkout.png)

确认订单里至少看清两件事：

- 域名年费是否为约 **₺75**，且计入「今天应付」
- Workspace 订阅本身是否仍在试用（试用期内通常不应立刻扣席位月费，但仍以账单为准）

付款方式支持 **Visa、Mastercard** 等国际信用卡/借记卡。持卡人姓名请填与银行卡一致的真实姓名；若勾选「账单邮寄地址与上述地址相同」，会沿用前面填写的土耳其地址。社区与实测里，实体外币卡成功率通常更高——笔者用 **招商银行全币种 Visa 信用卡** 完成过支付。

![Google Workspace：填写 Visa / Mastercard 付款方式](/images/tutorials/google-workspace-payment.png)

支付后流程里常会问是否「添加用户」：每多一位用户，试用结束后都会按席位加收月费（示意约 ₺170.80 / 人 / 月）。若你不需要额外账号，后续这类页面一律点 **「暂时跳过」** 即可。

![Google Workspace：添加用户页点击「暂时跳过」](/images/tutorials/google-workspace-skip-users.png)

随后还会出现若干引导页（想先处理什么任务、主要目标、是否已在用某些功能等），一律点 **「我还不确定」** / **「我不确定」**，跳过即可，不必逐项勾选。

![Google Workspace：引导页点击「我还不确定」](/images/tutorials/google-workspace-unsure-tasks.png)

![Google Workspace：主要目标页点击「我还不确定」](/images/tutorials/google-workspace-unsure-goals.png)

![Google Workspace：功能引导页点击「我不确定」](/images/tutorials/google-workspace-unsure-apps.png)

完成上面这些步骤后，一开始绑定的备用邮箱通常会收到 Squarespace 发来的域名联系人验证邮件（历史上 Google Domains 已迁转，域名管理常在 **Squarespace Domains** 后台）。

打开验证邮件后会显示多个按钮，先不要去点击 **VERIFY NOW**，往下滑动邮件，找到 **LOG IN** 按钮，点击它。若选择用 Google 授权登录，务必使用你刚创建的、带有域名后缀的企业邮箱完成授权，**不要**用个人 Gmail / 原先的 Google 账号。

![Squarespace：域名验证邮件中点击 LOG IN](/images/tutorials/google-workspace-squarespace-verify.png)

![Squarespace：选择 Continue with Google 并用企业邮箱授权](/images/tutorials/google-workspace-squarespace-login.png)

登录后即可在 Domains 列表里看到刚购买的域名。若状态为 **Action Required**，表示需在约 **15 天内**完成联系人邮箱验证：点进该域名查看详情，再回到你开通时绑定的**备用邮箱**查收并完成验证（未按时验证可能导致域名暂停）。

![Squarespace：域名状态 Action Required，需验证邮箱](/images/tutorials/google-workspace-squarespace-action-required.png)

![Squarespace：域名详情页提示需验证邮箱](/images/tutorials/google-workspace-squarespace-email-verify.png)

打开开通流程里绑定的**备用邮箱**，找到 Squarespace 发来的验证信（主题常见含 *Action Required* / *Verify your Squarespace domain contact*），点击 **VERIFY NOW** 完成联系人邮箱验证。

![Squarespace：备用邮箱中点击 VERIFY NOW](/images/tutorials/google-workspace-squarespace-verify-now.png)

验证完成后，域名状态会变为 **Active**。至此，Google Workspace 试用与自定义域名都已成功开通；若你只想保留域名、不需要 Workspace 席位，请继续做下一步——取消席位订阅。

![Squarespace：验证后域名状态变为 Active](/images/tutorials/google-workspace-squarespace-active.png)

### 5. 最关键：取消 Workspace 订阅，保留域名

很多人踩坑点在这里：买完域名后忘记取消 Workspace，试用结束后被扣席位费。

到管理控制台的结算 / 订阅页（常见入口：[订阅管理](https://admin.google.com/ac/billing/subscriptions)）核对：

- **Google Workspace**（试用中的席位订阅）→ 取消
- **域名 / Custom Domain**（年费约 ₺75）→ 保留为有效

在「管理 Workspace」页进入 **「管理订阅」**，点开 **Google Workspace 商务标准版**（或你当前的席位套餐）。在详情页左侧滚到底部，展开 **「更多」**，再选择 **「取消订阅」**；域名注册那一项不要动。

![Google Admin：管理 Workspace 中点击「管理订阅」](/images/tutorials/google-workspace-manage-subscriptions.png)

![Google Admin：订阅列表中点开 Google Workspace 席位](/images/tutorials/google-workspace-subscription-list.png)

取消后请再刷新确认一次：只剩域名相关计费，Workspace 显示已取消。

若你本来就需要企业邮箱、网盘协作，也可以保留 Workspace；土耳其区席位费相对全球标价也可能更低，但仍要按账单自行计算是否划算。

## 五、购域之后建议做什么

### 1. 改 DNS 到 Cloudflare（推荐）

Google / Squarespace 默认解析对建站、防护、证书并不总是最方便。更常见的做法是：

操作流程：

在 Squarespace Domains 后台进入 **DNS → DNS Settings**，即可查看当前解析记录，并按需添加、修改或删除。默认记录多指向 Squarespace；若域名仍由 Google Workspace 托管，改动前注意页面提示，避免影响邮箱等服务。

![Squarespace：DNS Settings 中管理解析记录](/images/tutorials/google-workspace-squarespace-dns.png)

若要把解析交给 Cloudflare 等第三方，打开左侧 **Domain Nameservers**。默认使用 Squarespace 自家 NS；点击 **USE CUSTOM NAMESERVERS**，在弹窗中填入 Cloudflare 提供的 Nameserver，再 **SAVE**（生效可能需数小时至 48 小时，改错可能影响网站与邮箱）。

![Squarespace：Domain Nameservers 点击 USE CUSTOM NAMESERVERS](/images/tutorials/google-workspace-squarespace-nameservers.png)

![Squarespace：填写自定义 Nameserver 并保存](/images/tutorials/google-workspace-squarespace-custom-ns.png)

先**不要关闭**该弹窗，另开一个浏览器窗口打开 [Cloudflare](https://www.cloudflare.com)，添加站点并拿到分配的 Nameserver 后再回来填写。

1. 在 Cloudflare 添加站点（Free 计划通常够用）：进入「域名 → 概览」，点击 **「添加域名」**。

![Cloudflare：域名概览页点击「添加域名」](/images/tutorials/google-workspace-cloudflare-add-domain.png)

在「添加站点」页选择 **「连接域名」**（把已有域名接到 Cloudflare；不要选「转移域名」或「购买域名」，除非你另有需要）。

![Cloudflare：添加站点页点击「连接域名」](/images/tutorials/google-workspace-cloudflare-connect-domain.png)

在「连接您的域名」页输入刚才购买的域名，继续下一步。

![Cloudflare：输入刚购买的域名](/images/tutorials/google-workspace-cloudflare-enter-domain.png)

计划选择 **「免费」**（US$0）即可，点击 **「选择计划」**。

![Cloudflare：选择免费计划](/images/tutorials/google-workspace-cloudflare-free-plan.png)

Cloudflare 会自动扫描并导入现有 DNS 记录。导入后，部分 A / CNAME 可能默认开着橙色 **「已代理」**；若暂不需要 Cloudflare 代理建站，建议先改成灰色 **「仅 DNS」**（关闭代理）。这些 A / CNAME 多半是 Squarespace 为自家建站生成的线路，可留作备用，也可以直接删掉。

请保留与 Google Workspace 相关的 **MX**、**TXT**（如 SPF / DKIM）记录：有了它们，Gmail 才能按该域名正确收发邮件，并向外界证明邮件未伪造。核对无后，点击 **「继续」** / **「前往激活」** 一类按钮进入下一步。

![Cloudflare：核对导入的 DNS 记录并关闭代理](/images/tutorials/google-workspace-cloudflare-dns-records.png)

若弹出「未受完全保护」提示（因记录为「仅 DNS」），点击 **「以后执行此操作」** 即可，不必现在改回代理。

![Cloudflare：提示未完全保护时点击「以后执行此操作」](/images/tutorials/google-workspace-cloudflare-do-later.png)

2. 拿到 Cloudflare 分配的 Nameserver

接着 Cloudflare 会分配给你两个名称服务器（Nameserver）地址（每人/每域可能不同，以页面显示为准），复制下来备用。

![Cloudflare：复制分配的两个 Nameserver](/images/tutorials/google-workspace-cloudflare-nameservers.png)

3. 回到 Squarespace 弹窗，把 NS 填成 Cloudflare 提供的地址并保存

保存时若提示需先关闭 **DNSSEC**：可把它理解成域名的防篡改「密码锁」。要把解析控制权从 Squarespace 交给 Cloudflare，须先关掉 DNSSEC，否则新 NS 无法正常生效、Cloudflare 也难以正确解析。按提示点击 **CONTINUE** 即可继续保存。

![Squarespace：更改 Nameserver 前点击 CONTINUE 关闭 DNSSEC](/images/tutorials/google-workspace-squarespace-disable-dnssec.png)

出现 **Changes Submitted** 后点击 **CLOSE**。相当于先把 DNSSEC 这把「锁」打开，等 NS 切换到 Cloudflare 并确认解析正常后，再视需要重新开启 DNSSEC 上锁。

![Squarespace：Changes Submitted 后点击 CLOSE](/images/tutorials/google-workspace-squarespace-changes-submitted.png)

4. 回到 Cloudflare，向下滚动页面，点击 **「我已更新名称服务器」**，让 Cloudflare 开始核验你在 Squarespace 侧的 NS 更改。

![Cloudflare：点击「我已更新名称服务器」](/images/tutorials/google-workspace-cloudflare-updated-ns.png)

5. 等待生效后，在 Cloudflare 配置 A / CNAME、HTTPS 等。核验通过后，概述页会出现类似 **「您的域现在受 Cloudflare 保护」** 的提示，即可继续配置解析与证书。

![Cloudflare：域名已生效并受保护](/images/tutorials/google-workspace-cloudflare-protected.png)

6. 在 Cloudflare 重新启用 DNSSEC：进入 **DNS → 设置**，点击 **「启用 DNSSEC」**，相当于把先前打开的「锁」重新上上（可选，但建议在 NS 已稳定生效后再开）。

![Cloudflare：DNS 设置中启用 DNSSEC](/images/tutorials/google-workspace-cloudflare-enable-dnssec.png)

7. 点击启用后，Cloudflare 会生成一套新的 **DS 记录**参数（摘要、算法、密钥标记等）。回到 Squarespace，打开 **DNS → DNSSEC**，点击 **ADD RECORD**，把 Cloudflare 给出的字段一一对应填入（Key Tag / Algorithm / Digest Type / Digest），先在 Cloudflare 侧点 **「确认」**，再在 Squarespace 点 **SAVE** 保存。

![Cloudflare：复制新生成的 DS 记录参数](/images/tutorials/google-workspace-cloudflare-ds-records.png)

![Squarespace：DNSSEC 页点击 ADD RECORD](/images/tutorials/google-workspace-squarespace-dnssec-add.png)

![对照填写 DS 记录并保存](/images/tutorials/google-workspace-dnssec-fill-ds.png)

这样后续建站、CDN、证书会更省心。Cloudflare 资源入口也可对照站内 [数字基建导航](/nav/digital-infra)。

### 2. 了解 60 天转移限制

按 ICANN 常见规则，**新注册域名通常 60 天内不能转到其他注册商**。前两个月可先用改 NS 的方式托管解析；满期后再考虑转入 Cloudflare Registrar 等平台。

### 3. 日历提醒续费

虽然社区反馈续费多为同价自动扣款，仍建议：

- 确认自动续费已开启
- 支付卡长期有效
- 续费日前检查邮件与账单货币是否仍为 TRY

## 六、风险与边界（务必看完）

- **区域定价可能调整**：汇率、滥用、政策变化都可能导致土耳其区域名涨价或关闭低价通道。不要假设「永远 ₺75」。
- **账号与支付风控**：异地登录、虚拟卡、信息不一致可能触发核验或失败。重要域名不要压在不稳定的账号上。
- **不是「免费域名」**：你买的是年费域名；便宜的是 TRY 定价，仍需每年续费。
- **合规与信息真实**：填写虚假身份/地址可能带来核验、冻结或纠纷风险。本站只整理公开路径信息，请自行判断是否适合你。
- **与国内备案无关**：在境外注册商持有 \`.com\`，并不自动解决中国大陆网站备案等问题；若站点要对国内用户提供服务，另按当地法规处理。

## 七、适合谁 / 不适合谁

**更可能适合**

- 想长期持有 \`.com\`，在意续费成本
- 已有外币卡，能接受一点账号与结算折腾
- 后续会接 Cloudflare、自建站、海外邮箱等数字基建

**更可能不适合**

- 完全不想处理地区结算、风控、英文后台
- 只需要国内备案站点、希望全程中文客服
- 需要立刻把域名转到其他注册商（注意 60 天限制）

## 八、相关入口

- [Google Workspace](https://workspace.google.com)
- [订阅管理（Admin）](https://admin.google.com/ac/billing/subscriptions)
- [Squarespace 账户 / 域名管理](https://account.squarespace.com/)（若你的域名已迁至该后台）
- [Cloudflare](https://www.cloudflare.com)
- 站内：[跨境数字基建导航](/nav/digital-infra)

产品价格与流程可能随时调整。下单前请以官方结账页的货币、金额与条款为准。

---

相关入口：[Google Workspace](https://workspace.google.com) · [数字基建导航](/nav/digital-infra)
`;

export const oqumailFreeDomainEmailGuide = `本页整理 **OquMail** 免费域名邮箱的定位、额度、DNS 绑定与创建邮箱步骤，仅供信息对照。配额、DNS 记录、验证方式与客户端能力会变化，请以 [OquMail 官网](https://oqumail.com) 与控制台当时显示为准。本页不构成注册、迁移或合规建议。

OquMail 解决的是「已有域名，想快速拥有 \`you@yourdomain.com\`」：域名可继续放在原注册商 / Cloudflare，只需按引导添加 MX / SPF / DKIM / DMARC 等记录。若你还没有可长期持有的域名，可对照站内 [Google Workspace 低价 .com 教程](/tutorials/google-workspace-domain-guide) 或 [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)。

## 一、OquMail 是什么

公开介绍里，OquMail 提供：

- 在你**已有域名**上创建企业邮箱（\`name@yourdomain.com\`）
- 引导式 DNS：复制粘贴 MX、SPF、DKIM、DMARC，并支持验证
- 网页端收发（Webmail）、签名、搜索与线程
- 按邮箱维度的发信 API（适合收据、通知等程序化外发）
- 管理后台：角色、限额、密码找回等

官网当前强调的免费额度（以定价页为准）：

| 项目 | 常见说明 |
| --- | --- |
| 免费邮箱数 | 每个 workspace 最多约 15 个邮箱 |
| 自定义域名 | 最多约 3 个 |
| 单箱容量 | 约 5 GB / 邮箱 |
| 每日外发 | 约 250 封 / 邮箱（人工与 API 共用） |
| 超出部分 | 额外邮箱约 \$1 / 月（以官网为准） |

## 二、适合谁 / 不适合谁

**更可能适合**

- 已有域名，想快速拥有品牌后缀邮箱做对外联络
- 小团队 / 个人项目，邮箱数量在免费额度内
- 主要用网页端收发，或需要轻量发信 API

**更可能不适合**

- 需要 Google 文档、网盘、会议等同套件能力
- 大规模营销群发（更适合专门的 ESP）
- 把关键生产、资金相关邮件完全押在免费额度与第三方服务稳定性上

> 官网定价页 FAQ / 对比表仍写 V1 以 Webmail 为主、暂不支持 IMAP 桌面客户端；但控制台已有 **Connect to app (IMAP)**，本页下文也按实测记录了 Outlook 自动发现登录。产品能力可能变化，请以控制台与实测为准。

## 三、准备材料

1. 一个你已拥有、且能改 DNS 的域名（Cloudflare / Namecheap / 注册商面板均可）
2. 可收信的注册邮箱（用于账号与重置密码）
3. 约 10–30 分钟；DNS 生效可能再等数分钟到数小时

## 四、注册与绑定域名

界面会改版，以下为常见步骤摘要，请以控制台为准。

### 1. 注册 OquMail

1. 打开 [OquMail 官网](https://oqumail.com) 并注册 / 登录

打开网站后，点击右上角的 **Get started free** 按钮。

![OquMail 官网：右上角 Get started free](/images/tutorials/oqumail-get-started-free.png)

进入创建账号页后，输入名字、登录邮箱（Gmail、Outlook 等个人邮箱均可）和密码，然后点击 **Continue**。

![OquMail：Create your account，填写名字、登录邮箱与密码](/images/tutorials/oqumail-create-account.jpg)

到第二步后，输入公司名字、经营类别、选择国家、输入手机号码（该号码不会做验证），然后点击 **Create account**。

![OquMail：About your business，填写公司信息后创建账号](/images/tutorials/oqumail-about-business.jpg)

输入注册邮箱收到的 6 位验证码进行验证，然后点击 **Verify & continue**。

![OquMail：Verify your email，输入邮箱验证码](/images/tutorials/oqumail-verify-email.png)

进入到主页面是这个样子。

![OquMail：主页面 Admin Dashboard](/images/tutorials/oqumail-inbox.png)

2. 进入控制台后，准备添加你的域名

进入主页面后，点击左侧 **Domains**，在右侧「Your domain name」输入你的根域名（如 \`example.com\`，不要填邮箱地址），勾选确认你拥有或可管理该域名的 DNS，然后点击 **Connect my domain**，此时会弹出 Connect DNS 对话框。

![OquMail：Domains，输入域名并 Connect my domain](/images/tutorials/oqumail-connect-domain.png)

若域名 DNS 托管在 **Cloudflare**，可直接点击 **Connect with Cloudflare**，授权关联 Cloudflare 账号后，OquMail 会在后台一键写好所需记录；若域名在其他平台，则需把弹窗中列出的解析记录（如所有权 TXT、MX 等）逐条添加到该域名的 DNS 面板。

![OquMail：Connect DNS，Cloudflare 一键关联或手动添加记录](/images/tutorials/oqumail-connect-dns.png)

注意：

- 若域名上仍有旧邮箱主机的 MX，可能造成分路投递；切换前确认旧服务可下线
- 不必改 Nameserver 到 OquMail；域名可继续留在原注册商
- 手动添加时请按弹窗中的主机名 / 类型 / 值逐条对照

若你是手动添加解析记录，全部加完后回到弹窗，点击 **I've added the records — Verify DNS**。

![OquMail：Connect DNS，点击 Verify DNS 验证解析](/images/tutorials/oqumail-verify-dns.png)

验证完成后，若 Ownership、MX、SPF、DKIM、DMARC 等记录均显示绿色 **Found**，即表示解析已添加正确并生效，可以开始创建邮箱。

![OquMail：Verification，全部记录显示 Found](/images/tutorials/oqumail-dns-verified.png)

### 3. 创建域名邮箱

1. DNS 验证通过后，创建邮箱本地部分（如 \`hello\` → \`hello@yourdomain.com\`）

点击主页面左侧 **Users & Mailboxes**，在页面右侧点击 **+ Add user**。

![OquMail：Users & Mailboxes，点击 Add user](/images/tutorials/oqumail-add-user.png)

在弹出的 **Add user & mailbox** 窗口中：填写用户名、选择国家；输入手机号（不要与注册账号时用的号码相同，此处同样不做短信验证）；填写域名邮箱前缀并选择域名；再选择角色——若是自己用，选 **Company admin (mail + admin)**，可同时收发邮件与管理后台；若只是给他人开箱，选仅收发邮件的角色即可。最后在「Send account details to」填入一个可收信的邮箱（可用注册时的个人邮箱），系统会向该地址发送初始化激活链接，然后点击 **+ Create & send invite**。

![OquMail：Add user & mailbox，填写用户与邮箱信息](/images/tutorials/oqumail-add-user-modal.png)

2. 按提示设置或重置密码（常会发一封设置密码邮件到你的联系邮箱）

打开邀请邮件，点击 **Set your password**。

![OquMail：邀请邮件，点击 Set your password](/images/tutorials/oqumail-set-password-email.png)

在打开的新页面中输入密码、确认密码，然后点击 **Activate my account** 激活账户。

![OquMail：设置密码并 Activate my account](/images/tutorials/oqumail-activate-account.png)

3. 登录 OquMail，用新地址给自己发一封测试信，确认收发与垃圾箱策略

用刚激活的**域名邮箱账号**登录 OquMail（登录页可用邮箱地址，不是注册时的个人邮箱）。

![OquMail：用域名邮箱登录](/images/tutorials/oqumail-login-mailbox.png)

登录后点击左侧 **Compose**，在右侧 **To** 填入收件人邮箱，写好主题与正文，再点 **Send**。若对方能正常收到，说明发信功能正常。

![OquMail：Compose 撰写并 Send 测试发信](/images/tutorials/oqumail-compose-send.png)

再测收信：让对方回复你的域名邮箱；回到主页面点击左侧 **Inbox**，若能看到来信，说明收信也正常。至此收发测试完成。

![OquMail：Inbox 查看收件](/images/tutorials/oqumail-inbox-receive.png)

### 4. 第三方客户端登录

官网文案目前仍写「暂不支持第三方客户端」，但实测可以：登录后点击左侧 **Connect to app (IMAP)**，页面会列出在第三方客户端里手动配置时所需的全部服务器参数（如收信服务器 \`mail.oqumail.com\`、端口 \`993\` 等）。下面以最常用的电脑版 **Outlook** 为例演示。

![OquMail：Connect to app (IMAP)，查看服务器参数](/images/tutorials/oqumail-connect-imap.png)

打开 Outlook，选择添加账户，再点击 **创建新账户**，填入刚才创建好的域名邮箱。

![Outlook：添加账户，点击创建新账户](/images/tutorials/oqumail-outlook-add-account.png)

输入域名邮箱后按提示填写密码，一步步继续；稍等片刻即可登录成功。虽然 Connect to app 页列出了较完整的服务器参数，但多数情况下**不必手动填写**——只需邮箱和密码，Outlook 会在后台自动完成配置。这是因为现代客户端普遍内置自动发现：只要域名的 MX 已正确指向 OquMail，客户端就能顺藤摸瓜配好收发。至此即可在 Outlook 里用自己的域名邮箱收发邮件。

![Outlook：输入域名邮箱并继续](/images/tutorials/oqumail-outlook-enter-email.png)

![Outlook：域名邮箱已成功登录](/images/tutorials/oqumail-outlook-success.png)

## 五、常见问题

**必须把域名转到 OquMail 吗？**
不必。只需在现有 DNS 面板添加记录。

**免费真的够用吗？**
对个人品牌、小团队外联，15 邮箱 + 3 域名通常够用；超出按邮箱加购。限额与日发送上限以官网为准。

**能用 Outlook 等第三方客户端吗？**
官网仍写 Webmail-first、暂不支持 IMAP；实测可通过 **Connect to app (IMAP)** 查看参数，Outlook 在 MX 正确时往往只需邮箱和密码即可自动发现并登录。其他客户端以当时实测为准。

**和 Google Workspace / Zoho 怎么选？**
要免费额度 + 简单 DNS + 轻量 API，可优先试 OquMail；要桌面客户端或全家桶协作，再看 Workspace / Zoho。可对照站内 [Workspace 域名相关教程](/tutorials/google-workspace-domain-guide)。

## 六、相关入口

- 官网：[oqumail.com](https://oqumail.com)
- 定价与 FAQ：[oqumail.com/pricing](https://oqumail.com/pricing)
- 站内导航卡片：[数字基建 · OquMail](/digital-infra)
- 低价持有 \`.com\`：[Google Workspace 低价域名教程](/tutorials/google-workspace-domain-guide)
`;

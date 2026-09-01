export const lebaraAccountGuide = `本页整理通过 **[Lebara UK](https://www.lebara.co.uk)** 购买英国预付费套餐、选择 eSIM、写入手机并激活的常见流程，仅供信息对照。套餐、价格、支付方式、配送与页面文案会变化，请以 [Lebara 英国官网](https://www.lebara.co.uk) 当时显示为准。本页不构成开户或通讯服务建议。

Lebara 是英国常见的预付费运营商（网络侧通常依托本地运营商覆盖），适合需要 **+44 英国号码** 的场景：接收短信验证、注册海外服务、基础通话与流量等。可买实体 SIM，也可选 **eSIM**（下单后邮件发二维码，通常更快）。

## 使用前注意

1. **设备要支持 eSIM**：港版 / 美版等机型通常可以；部分大陆版机型没有原生 eSIM，需先准备 [Xesim 适配卡](/tutorials/xesim-esim-adapter-guide)。
2. **下单信息**：官网结账一般会要求邮箱与支付方式；部分计划可能要求英国地址（以页面提示为准）。支付常见支持 Visa / Mastercard、PayPal、Apple Pay、Google Pay 等。
3. **激活环境**：安装 eSIM 时建议连接稳定 Wi‑Fi；首次入网后先关闭数据漫游，再按套餐规则测试短信、通话与流量，避免意外产生高额漫游费。
4. **各国站点不同**：Lebara 在不同国家有独立站点与规则。本页以 **英国站 lebara.co.uk** 为主；西班牙等站点可能要求本地身份核验，流程不同。

## 保号注意

可用约 **£5** 余额保号：大致做法是 **每 90 天内发送至少一条短信**，产生一条消费记录。在国内发短信约 **£0.49 / 条**，有余额变动通常即可计为保号活动。按此粗算，£5 理论上大约能撑 **两年半**（资费与保号规则以官网当时说明为准，请勿当作承诺）。

## 一、确认手机是否支持 eSIM

打开拨号键盘，输入 \`*#06#\`，查看是否有 **EID**：

- **有 EID**：可直接扫码安装 Lebara eSIM。
- **没有 EID**：先按 [大陆手机用 Xesim 安装 eSIM 适配器教程](/tutorials/xesim-esim-adapter-guide) 完成适配卡准备，再扫服务商二维码写入。

## 二、购买与开户流程（Lebara UK）

### 1. 注册账号

打开 [Lebara UK 官网](https://www.lebara.co.uk)，点右上角 **Login**：

- 已有账号：直接登录
- 没有账号：切到 **Register**，填写邮箱与密码，完成验证后点 **Register**

![Lebara UK：点右上角 Login；有账号直接登录，无账号切到 Register，填写邮箱与密码，完成验证后点 Register](/images/tutorials/lebara-register.png)

### 2. 选择套餐

登录后进入 **SIM Only Deals** 套餐页，按需求选择流量与通话档位。若只是为了拿号保号，选当时最便宜的一档通常就够。点 **Show Details** 进入详情，再点 **Buy**（页面上的 GB、分钟数与国际通话权益以当时选项为准）。

![Lebara UK：选择套餐](/images/tutorials/lebara-select-plan.png)

![Lebara UK：购买页面](/images/tutorials/lebara-buy.png)

### 3. 选择 eSIM

结账路径里通常可选择 eSIM 或实体 SIM：

- **eSIM**：下单后邮件发送激活二维码 / 安装码，适合希望尽快拿到号码的场景
- **实体 SIM**：需等待邮寄，时效可能是几天到一周不等，不确定性更高

本教程以 **eSIM** 为主，也更推荐优先选 eSIM。

![Lebara UK：选择 eSIM](/images/tutorials/lebara-select-esim.png)

### 4. 填写个人信息与地址

按页面提示填写个人信息与地址，填完后点 **Continue**。

![Lebara UK：填写个人信息与地址](/images/tutorials/lebara-input-info.png)

若选择手动输入地址，可用 [英国地址生成器](https://www.meiguodizhi.com/uk-address) 生成示例地址后再填入（请自行核对格式是否符合页面校验；本站不对第三方工具负责）。

### 5. 输入优惠码

在优惠码栏输入 \`LEBARA5\`（示例场景下折后约 **£1.49** 开卡，以结算页实付为准），再点 **PROCEED TO PAYMENT**。

![Lebara UK：输入优惠码](/images/tutorials/lebara-input-coupon.png)

随后选择支付方式，常见支持 Visa / Mastercard、PayPal 等。

### 6. 填写结账信息并支付

按页面输入卡号、有效期、CVV 与持卡人姓名。姓名需与银行卡背面 / 账单姓名一致。示例可用招商银行全币种 Visa 信用卡完成支付；填好后点 **Pay**。

![Lebara UK：填写结账信息并支付](/images/tutorials/lebara-input-payment.png)

支付成功后，页面大致如下：

![Lebara UK：支付成功](/images/tutorials/lebara-payment-success.png)

### 7. 查收激活邮件

支付成功后，留意注册邮箱中的 Lebara 邮件，通常会包含：

- eSIM **二维码**，或
- 可手动输入的 **激活码 / SM-DP+ 地址**

请妥善保存。二维码通常只有有限次成功安装机会，不要随意转发。

### 8. 在手机上安装 eSIM

- **本机支持 eSIM**：按系统提示添加蜂窝号码 / eSIM 即可
- **本机不支持 eSIM**：先按 [Xesim 适配器教程](/tutorials/xesim-esim-adapter-guide) 完成写入，再扫描 Lebara 二维码完成配置（细节以适配卡厂商与 Lebara 当时指引为准）

### 9. 激活与自测

安装完成后、正式启用前，建议先 **关闭数据漫游**，降低高额国际漫游费用风险。

1. **看信号**：激活后确认是否有信号。若无信号，可在「设置 → 移动网络 → 对应 SIM → SIM 卡信息与设置」里尝试手动选网；仍不佳时可重启手机再试。

   实测提示：系统自动分配的网络不一定最合适。例如曾出现默认连上中国联通时，部分平台验证码收不到；手动改选中国移动后，可收到的验证码范围更广（以你当地信号与平台策略为准，需自行试错）。

2. **确认号码**：有信号后，通常会收到一条包含本机号码的短信，邮箱也可能同步收到邮件。短信示例如下：

![Lebara UK：收到短信](/images/tutorials/lebara-receive-sms.png)

### 10. 后台一直显示 You don't have a plan？

购买套餐后，若后台仍提示没有套餐，常见原因是：在英国境外时，套餐未必会立刻完全激活。除连接英国本土基站外，也可通过充值 **Pay as you go** 话费来推进激活。

操作建议：

1. 登录官网，点右上角 **Account → Dashboard**（页面：[My Lebara](https://www.lebara.co.uk/en/mylebara.html)）
2. 下滑找到 **Pay as you go**，充值约 **£5**
3. 充值完成后刷新页面，一般就能看到当前套餐与余额

![Lebara UK：Pay as you go 充值](/images/tutorials/lebara-pay-go.png)

### 11. 如何关闭自动续费

进入管理页，点 **manage**：

![Lebara UK：管理页面](/images/tutorials/lebara-manage.png)

在 **Automatic renewal** 中关掉右侧开关，并在弹窗里选择 **Cancel Plan** 关闭自动续费。

![Lebara UK：关闭自动续费](/images/tutorials/lebara-close-pay.png)

### 12. 如何解绑付费卡

点右上角 **Account → payment-method**（页面：[Payment method](https://www.lebara.co.uk/en/mylebara/payment-method.html)），依次：

1. 取消默认支付方式

![Lebara UK：取消默认支付方式](/images/tutorials/lebara-default-off.png)

2. 取消其他已保存的支付方式

![Lebara UK：取消其他支付方式](/images/tutorials/lebara-other-off.png)

两步完成后即可解绑付费卡，减少意外扣费风险。

## 三、无法发送短信怎么办

**常见原因**：新卡常有约 **7 天漫游限制期**。期间一般仍可 **接收** 短信，但可能无法 **发送**。

**处理**：先等到约 7 天限制期结束后再试发短信。

![Lebara UK：漫游限制期](/images/tutorials/lebara-limit-days.png)

若已超过约 7 天仍发不出短信，限制往往 **不会自动解除**，需要联系客服手动处理。

可前往 [人工客服](https://www.lebara.co.uk/en/help/contact-us.html)，话术示例：

\`\`\`
Hi, I'm currently roaming in China. I can receive SMS but cannot send any, even though I have enough credit and the 7-day limit has passed. Could you please manually remove the 'roaming block' on my account from your system? Thank you!
\`\`\`

补充：并非每位客服都会当场协助解除。可结束当前会话后重新发起咨询，多试几次通常更有机会。

## 四、和 eSIM.GG 怎么选（简要）

| | Lebara UK | eSIM.GG |
| --- | --- | --- |
| 号码区号 | 多为 +44 英国号 | 多为 +372 爱沙尼亚号 |
| 形态 | 套餐制预付费，可选 eSIM / 实体卡 | 偏号码 + 预存 / 保号模式 |
| 常见用途 | 英国本地通讯、部分需英号的服务 | 长期持号、海外验证码等 |

两者不互相替代，可按目标服务要求的国家码来选。eSIM.GG 流程可对照：[eSIM.GG 购买与安装教程](/tutorials/esim-gg-account-guide)。

---

相关入口：[Lebara UK 官网](https://www.lebara.co.uk) · [境外手机卡导航](/nav/overseas-sim)
`

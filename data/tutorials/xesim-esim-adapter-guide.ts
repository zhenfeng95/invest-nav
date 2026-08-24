export const xesimEsimAdapterGuide = `本页整理中国大陆机型通过 **[Xesim](https://xesim.cc/)** 适配卡安装、绑定并写入境外 eSIM 的常见流程，仅供信息对照。机型兼容性、套餐版本、价格和 App 界面会变化，请以 [Xesim 官网](https://xesim.cc/) 与 App 当时显示为准。本页不构成购买或通讯服务建议。

很多大陆版手机没有原生 eSIM（拨号 \`*#06#\` 看不到 EID）。Xesim 的思路是：先插入一张实体适配卡，再用 App / SIM 卡菜单把境外 eSIM 配置写进去，让手机也能长期使用海外号码。

买号与装号可对照：[eSIM.GG 爱沙尼亚预付费 eSIM 购买与安装教程](/tutorials/esim-gg-account-guide)。

## 一、注册与选购

### 1. 打开官网并注册

打开 [Xesim 官网](https://xesim.cc/)，新用户先完成注册。

![Xesim 官网：点击右上角账号图标，在登录弹窗中点「新客户？从这里开始」完成注册](/images/tutorials/xesim-register.png)

### 2. 填写表单创建账号

按页面提示填写表单，创建新账号。

![Xesim 官网：填写表单创建账号](/images/tutorials/xesim-form.png)

### 3. 登录后进入购买页

登录后，点击顶部「立即购买」，进入套餐选择页面。

![Xesim 官网：点击顶部「立即购买」，进入套餐选择页面](/images/tutorials/xesim-buy-now.png)

### 4. 先看选购向导

页面里有选购向导，建议先点进去对照：**不同机型适合的版本不一样**，不要凭感觉下单。

### 5. 安卓 / 鸿蒙：购买前务必先装 App 自检

安卓或鸿蒙用户在付款前，一定要先下载 **Xesim App**，确认界面里是否显示**支持当前 SIM 卡槽**。

再按自身情况选版本：

- 卡槽显示支持：可按向导选择合适版本
- **卡槽不支持：请选 X2 Pro**，避免买回来无法使用

这一步容易选错，建议反复核对后再下单。

![Xesim 官网：安卓 / 鸿蒙用户在付款前，一定要先下载 Xesim App，确认界面里是否显示支持当前 SIM 卡槽](/images/tutorials/xesim-is-support.png)

### 6. 苹果用户：直接选 X2 Pro

苹果用户一般直接选 **X2 Pro**。如果现在用安卓、以后可能换成苹果，也可以优先考虑 X2 Pro，减少换机后的兼容问题。

### 7. 容量与下单

需要多号场景时，可选**大容量版**（官网说明理论约可存约 30 个 eSIM，以当时页面为准），确认版本后点「立即购买」。

![Xesim 官网：需要多号场景时，可选大容量版（官网说明理论约可存约 30 个 eSIM，以当时页面为准），确认版本后点「立即购买」](/images/tutorials/xesim-capacity.png)

### 8. 填写地址与折扣码

在付款页：

- 左侧填写收货地址
- 右侧填入专属折扣码 \`jrb8hm\`，点「验证」后通常可享 **95 折**（优惠以结算页显示为准）

![Xesim 官网：在付款页：左侧填写收货地址，右侧填入专属折扣码 \`jrb8hm\`，点「验证」后通常可享 **95 折**（优惠以结算页显示为准）](/images/tutorials/xesim-receipt.png)

### 9. 支付

支持支付宝、微信支付。点「完成订单」后，在跳转页扫码完成支付。

### 10. 收货与开箱

物流时效因地区而异。北京地区收货通常较快；示例订单从北京仓发出。到手一般是一张**实体 SIM 卡**，这就是 Xesim 适配器本体。

![Xesim 适配器开箱](/images/tutorials/xesim-example-one.png)

![Xesim 适配器开箱](/images/tutorials/xesim-example-two.png)

## 二、插入卡片并绑定 App

取出实体卡，插入手机 SIM 卡槽。下面按系统分别说明。

### 苹果：绑定 Xesim

1. 在 App Store 搜索 **Xesim**，下载并安装。
2. 登录账号，进入绑定流程。

![Xesim iOS 首页](/images/tutorials/xesim-ios-home.png "414")

3. 点「绑定」，输入卡片 **EID**（通常印在实体 SIM 卡背面 / 下方），也可扫描录入。

![Xesim iOS 绑定](/images/tutorials/xesim-ios-bind.png "414")

4. 按提示通过**短信**完成验证。

![Xesim iOS 短信验证](/images/tutorials/xesim-sms-verify.png "414")

5. 回到 Xesim 首页，应能看到该卡的**使用期限**、**下载次数**等信息。

![Xesim iOS 下载频率](/images/tutorials/xesim-download-frequency.png "414")

### 安卓：用 App 管理 eSIM

1. 在 Google Play 搜索 **Xesim**，下载并安装（获取渠道以官网说明为准）。
2. 打开 App，切到 **eSIM** 页面。

![Xesim Android eSIM](/images/tutorials/xesim-android-esim.png "414")

3. 点右侧「添加 eSIM」，即可按指引添加。

![Xesim Android 扫描](/images/tutorials/xesim-android-scan.png "414")

从日常管理上看，安卓端往往更直接：支持在 App 内下载、安装和切换 eSIM。

## 三、苹果与安卓 App 能力对比

| | 苹果 | 安卓 |
|---|---|---|
| 绑定卡片 EID | 支持 | 支持 |
| 在 App 内直接下载 / 安装 eSIM | 基本不支持，App 偏辅助 | 支持，可完成完整流程 |
| 切换、管理机内 eSIM | 更多依赖系统蜂窝设置 + SIM 卡菜单 | App 内操作通常更完整 |

一句话：**苹果端 App 主要负责绑定与辅助；安卓端 App 能把下载、安装、切换管理做完。**

## 四、实操：把海外 eSIM 写入适配卡

目标：让这张 Xesim 真正装上你自己的海外 eSIM 配置（号码或流量套餐二维码来自运营商 / 卖家，例如 eSIM.GG）。

### 苹果：通过蜂窝网络与 SIM 卡菜单下载

1. 打开系统「蜂窝网络」，点选刚插入的那张 SIM。

![Xesim iOS 网络](/images/tutorials/xesim-ios-net.png "414")

2. 滑到页面底部，打开**数据漫游**，再进入 **SIM 卡应用程序**。

![Xesim iOS 程序](/images/tutorials/xesim-ios-program.png "414")

3. 看到 **Xesim** 相关入口后点进去。

![Xesim iOS 入口](/images/tutorials/xesim-ios-entry.png "414")

4. 选择 **Download eSIM**。

![Xesim iOS 下载](/images/tutorials/xesim-ios-download.png "414")

5. 页面需要填一串激活码：用支付宝（或其他扫码工具）扫描商家提供的安装二维码，得到以 \`LPA:\` 开头的字符串，复制粘贴进去，再点发送。

![Xesim iOS 发送](/images/tutorials/xesim-ios-send.png "414")

6. 下载需要一段时间，**期间尽量不要锁屏**。出现 **Download successfully** 后，点下方「接受」。

![Xesim iOS 时间](/images/tutorials/xesim-ios-time.png "414")

7. 回到列表，打开 **eSIM List**，应能看到刚下载成功的 eSIM。

![Xesim iOS 俱乐部](/images/tutorials/xesim-ios-club.png "414")

8. 点进该条目，选 **Enable eSIM** 启用。等待片刻后，通常可以开始收发短信（以运营商侧开通进度为准）。

![Xesim iOS 启用](/images/tutorials/xesim-ios-enable.png "414")

### 省事做法：先在安卓写好，再插到苹果

若手头还有安卓机：可先在安卓上完成下载与写入，再把实体卡拔出插入苹果，到苹果端启用即可。很多时候会比全程在苹果菜单里操作更省事。

---

写好适配卡后，继续买号与保号可看：[eSIM.GG 购买与安装教程](/tutorials/esim-gg-account-guide)。

相关入口：[Xesim 官网](https://xesim.cc/) · [境外手机卡导航](/nav/overseas-sim)
`;

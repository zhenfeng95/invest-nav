<script setup lang="ts">
import { SITE_CONTACT_EMAIL, SITE_NAME, SITE_URL } from '~/utils/site'

usePageSeo({
  title: '隐私政策｜浏览数据与第三方服务',
  description: `${SITE_NAME} 隐私政策：说明本站如何处理浏览数据、本地偏好、第三方嵌入服务，以及日后可能接入的统计分析或广告相关信息，并告知如何联系我们查询或反馈。`,
  path: '/privacy',
})
</script>

<template>
  <AppContainer class="py-12 sm:py-16">
    <article class="max-w-2xl">
      <PageHero
        eyebrow="Privacy"
        title="隐私政策"
        description="本政策说明 Zhen Invest 如何处理与网站访问相关的信息。我们当前不提供注册、登录或会员系统。"
      />
      <div class="mt-10 space-y-8 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
        <p class="text-xs text-zinc-400">最近更新：2026-09-15</p>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">适用范围</h2>
          <p>
            本政策适用于 {{ SITE_URL }}（{{ SITE_NAME }}）及其子路径上的公开网页。
            你点击离开本站后进入的第三方网站、App 或服务，由对方自行负责隐私与数据处理，不在本政策范围内。
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">我们收集什么</h2>
          <p>当前站点<strong>不提供账户体系</strong>，不会要求你注册，也不会主动收集姓名、证件号、银行卡号等用于识别个人身份的账户资料。</p>
          <p>与访问相关的信息可能包括：</p>
          <ul class="list-disc space-y-2 pl-5">
            <li>
              <strong>本地偏好：</strong>主题模式（Light / Dark / System）等设置保存在你的浏览器本地（如 localStorage），用于记住显示偏好，不会上传到我们的自建用户数据库（本站目前也没有这类数据库）。
            </li>
            <li>
              <strong>技术与访问日志：</strong>网站经 CDN / 托管服务（如 Cloudflare）分发时，服务商可能按行业惯例记录 IP、User-Agent、请求路径、时间戳等，用于安全防护、性能与故障排查。我们不会把这些日志用于建立面向个人的营销画像。
            </li>
            <li>
              <strong>你主动发送的内容：</strong>若你通过邮件联系我们，邮件正文、发件地址与附件会进入邮箱系统，仅用于回复与处理你提出的问题。
            </li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">Cookie 与类似技术</h2>
          <p>
            本站可能使用 Cookie 或本地存储来维持主题偏好、保障站点基本功能，或由托管/安全服务设置必要的技术 Cookie。
            你可以通过浏览器设置管理或清除 Cookie；禁用后部分显示偏好可能无法保留。
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">第三方服务</h2>
          <p>为提供页面样式与站点可用性，本站可能加载以下类型的第三方服务：</p>
          <ul class="list-disc space-y-2 pl-5">
            <li>
              <strong>字体服务：</strong>当前通过 Google Fonts 加载部分网页字体；访问时浏览器可能向 Google 请求字体资源，其处理方式以 Google 相关政策为准。
            </li>
            <li>
              <strong>托管与 CDN：</strong>页面与静态资源可能经 Cloudflare 等基础设施分发。
            </li>
          </ul>
          <p>
            若后续接入网站分析（如访问量统计）或展示广告（如 Google AdSense），我们会在本页补充说明所用服务、大致用途，以及你可如何管理相关偏好。
            接入前，相关脚本不会用于向你展示个性化广告。
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">我们如何使用信息</h2>
          <ul class="list-disc space-y-2 pl-5">
            <li>提供、维护与改进网站内容与访问体验</li>
            <li>保障安全、防滥用与排查故障</li>
            <li>回复你主动发起的联络</li>
            <li>在接入分析或广告后，用于了解内容表现或支持站点运营（届时以更新后的本政策为准）</li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">信息共享</h2>
          <p>
            我们不会出售你的个人信息。仅在以下情形可能与第三方共享与访问相关的数据：
            为运营网站所必需的服务商（如托管、CDN、日后的分析或广告平台）、法律法规要求，或为保护本站与用户的合法权益所必需。
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">未成年人</h2>
          <p>
            本站内容面向有能力独立理解投资与合规风险的成年读者。我们不会故意收集未成年人的个人信息。
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">政策更新</h2>
          <p>
            若收集范围、第三方服务或用途发生变化，我们会更新本页并调整「最近更新」日期。
            重大变更时，我们会尽量在站点显著位置提示。继续使用本站即表示你了解更新后的政策。
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">联系我们</h2>
          <p>
            如对本政策或个人信息处理有疑问，请发送邮件至
            <a
              :href="`mailto:${SITE_CONTACT_EMAIL}`"
              class="text-accent underline-offset-2 hover:underline"
            >{{ SITE_CONTACT_EMAIL }}</a>。
            更多联络说明见
            <NuxtLink to="/contact" class="text-accent underline-offset-2 hover:underline">联系我们</NuxtLink>。
          </p>
        </section>
      </div>
    </article>
  </AppContainer>
</template>

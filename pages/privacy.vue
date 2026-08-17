<script setup lang="ts">
usePageSeo({
  title: '隐私政策',
  description: '投资导航第一阶段不收集用户账户信息，也没有登录和会员系统。',
  path: '/privacy',
})
</script>

<template>
  <AppContainer class="py-12 sm:py-16">
    <article class="max-w-2xl">
      <PageHero
        eyebrow="Privacy"
        title="隐私政策"
        description="第一阶段网站以公开信息整理为主，不提供注册、登录或用户中心。"
      />
      <div class="mt-10 space-y-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
        <p>当前版本不会主动收集可用于识别个人身份的账户数据。</p>
        <p>后续如接入分析、表单或云服务，会在本页同步更新说明。</p>
        <p>主题偏好仅保存在你的浏览器本地，用于 Light / Dark / System 切换。</p>
      </div>
    </article>
  </AppContainer>
</template>

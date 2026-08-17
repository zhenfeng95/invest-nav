<script setup lang="ts">
usePageSeo({
  title: '联系我们',
  description: '关于投资导航网站的合作与内容勘误，可通过后续公开渠道联系。',
  path: '/contact',
})
</script>

<template>
  <AppContainer class="py-12 sm:py-16">
    <article class="max-w-2xl">
      <PageHero
        eyebrow="Contact"
        title="联系我们"
        description="第一阶段暂不开放表单提交，避免引入用户系统和后端存储。"
      />
      <div class="mt-10 space-y-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
        <p>如果你发现资源链接失效、官方地址变更或内容需要勘误，后续会提供公开联系方式。</p>
        <p>当前请先通过 Git 仓库或部署后的站点说明进行反馈。</p>
      </div>
    </article>
  </AppContainer>
</template>

<script setup lang="ts">
import { SITE_DISCLAIMER } from '~/utils/site'

usePageSeo({
  title: '免责声明',
  description: SITE_DISCLAIMER,
  path: '/disclaimer',
})
</script>

<template>
  <AppContainer class="py-12 sm:py-16">
    <article class="max-w-2xl">
      <PageHero eyebrow="Disclaimer" title="免责声明" :description="SITE_DISCLAIMER" />
      <div class="mt-10 space-y-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
        <p>本站展示的券商、银行、平台和工具信息不构成推荐、邀约或任何形式的投资建议。</p>
        <p>任何开户、转账、交易和资产配置决策，都应基于你自己的判断，并在必要时咨询持牌专业人士。</p>
        <p>市场有风险，过往信息整理不代表未来结果。请以各机构官方披露为准。</p>
      </div>
    </article>
  </AppContainer>
</template>

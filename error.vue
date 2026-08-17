<script setup lang="ts">
usePageSeo({
  title: '页面不存在',
  description: '你访问的页面不存在。',
})
</script>

<template>
  <NuxtLayout>
    <AppContainer class="py-24">
    <EmptyState
      eyebrow="404"
      title="页面不存在"
      description="链接可能已失效，或这个地址还没有对应页面。"
    >
      <NuxtLink
        to="/"
        class="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
      >
        返回首页
      </NuxtLink>
    </EmptyState>
  </AppContainer>
  </NuxtLayout>
</template>

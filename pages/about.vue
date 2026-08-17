<script setup lang="ts">
usePageSeo({
  title: '关于我们',
  description: '投资导航是一个面向美股、加密货币和跨境出海的信息整理网站。',
  path: '/about',
})
</script>

<template>
  <AppContainer class="py-12 sm:py-16">
    <article class="max-w-2xl">
      <PageHero
        eyebrow="About"
        title="关于我们"
        description="投资导航不是交易软件，也不是行情软件，而是投资资源、教程与工具的入口。"
      />
      <div class="mt-10 space-y-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
        <p>
          我们把美股、加密货币、基金、ETF、香港银行、美股券商、资金流转和出入金相关的公开资源整理到一起，帮助你更快找到下一步该看什么。
        </p>
        <p>
          第一阶段先完成网站骨架、页面结构和数据层。用户系统、支付、实时行情和真实金融计算会在后续阶段再接入。
        </p>
      </div>
    </article>
  </AppContainer>
</template>

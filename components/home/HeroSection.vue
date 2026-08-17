<template>
  <section class="relative overflow-hidden pb-6 pt-14 sm:pt-20 lg:pt-24">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(111,143,130,0.12),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(111,143,130,0.16),_transparent_52%)]"
    />
    <AppContainer>
      <div class="max-w-3xl">
        <p class="text-xs font-medium uppercase tracking-[0.22em] text-accent">Investment Navigation</p>
        <h1 class="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
          投资导航
        </h1>
        <p class="mt-5 max-w-xl text-lg leading-8 text-zinc-600 sm:text-xl dark:text-zinc-300">
          美股、加密货币、跨境出海<br class="hidden sm:block">
          一站式投资导航平台
        </p>
        <p class="mt-6 max-w-lg text-sm leading-7 text-zinc-500 sm:text-base dark:text-zinc-400">
          发现投资工具、学习投资知识，<br>
          寻找券商、银行、资金流转与投资资源。
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink
            to="/nav"
            class="focus-ring inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            浏览导航
          </NuxtLink>
          <NuxtLink
            to="/tutorials"
            class="focus-ring inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:border-white/20 dark:hover:text-white"
          >
            查看教程
          </NuxtLink>
        </div>
      </div>
    </AppContainer>
  </section>
</template>

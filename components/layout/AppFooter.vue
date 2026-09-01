<script setup lang="ts">
import { footerAboutLinks, footerCategoryLinks, SITE_DISCLAIMER, SITE_NAME, SITE_NAME_EN, SITE_TAGLINE } from '~/utils/site'
</script>

<template>
  <footer class="border-t border-zinc-200/80 bg-white/70 dark:border-white/[0.06] dark:bg-black/20">
    <AppContainer>
      <div class="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div class="sm:col-span-2 lg:col-span-2">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-accent dark:border-white/10 dark:bg-white/5">
              <AppIcon name="logo" class="h-4 w-4" />
            </span>
            <span class="text-sm font-semibold tracking-tight">{{ SITE_NAME }}</span>
          </NuxtLink>
          <p class="mt-4 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {{ SITE_TAGLINE }}。帮助你更快找到教程、工具、券商、银行与资金流转资源。
          </p>
        </div>

        <div>
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ SITE_NAME }}</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="item in footerAboutLinks" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">投资分类</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="item in footerCategoryLinks" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-zinc-200/80 py-6 dark:border-white/[0.06]">
        <p class="text-xs text-zinc-400">© 2026 {{ SITE_NAME_EN }}</p>
        <p class="mt-2 text-xs leading-5 text-zinc-400">
          免责声明：{{ SITE_DISCLAIMER }}
        </p>
      </div>
    </AppContainer>
  </footer>
</template>

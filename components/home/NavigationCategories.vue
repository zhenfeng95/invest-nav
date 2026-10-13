<script setup lang="ts">
import { getListedNavigationCategories } from '~/utils/navigation'

const categories = getListedNavigationCategories()
</script>

<template>
  <section>
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <SectionTitle
        title="资源导航"
        description="按主题进入境外银行、手机卡、券商、资金路径与数字基建。"
      />
      <NuxtLink
        to="/nav"
        class="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
      >
        查看全部
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </NuxtLink>
    </div>
    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NavigationCategory
        v-for="category in categories"
        :key="category.id"
        :category="category"
      />
    </div>
  </section>
</template>

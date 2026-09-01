<script setup lang="ts">
import { getNavigationCategories } from '~/utils/navigation'

const categories = getNavigationCategories()
</script>

<template>
  <section>
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <SectionTitle
        title="资源导航"
        description="按主题快速进入美股、加密货币、银行、券商和资金路径。"
      />
      <NuxtLink
        to="/nav"
        class="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
      >
        全部分类
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </NuxtLink>
    </div>
    <div class="-mx-4 mt-8 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
      <div class="flex min-w-max gap-4 sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-5">
        <NavigationCategory
          v-for="category in categories"
          :key="category.id"
          :category="category"
          class="w-64 sm:w-auto"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getFeaturedNavigationItems } from '~/utils/navigation'
import { getLatestTutorials } from '~/utils/tutorials'

const tutorials = getLatestTutorials(3)
const resources = getFeaturedNavigationItems(3)
</script>

<template>
  <section>
    <SectionTitle
      title="最新内容"
      description="最近更新的教程与导航资源。"
    />
    <div class="mt-8 grid gap-4 lg:grid-cols-2">
      <div class="space-y-3">
        <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">最新教程</p>
        <NuxtLink
          v-for="item in tutorials"
          :key="item.id"
          :to="`/tutorials/${item.slug}`"
          class="card card-hover flex items-start justify-between gap-4 p-4"
        >
          <div>
            <p class="text-sm font-medium text-zinc-900 dark:text-zinc-50">{{ item.title }}</p>
            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{{ item.category }}</p>
          </div>
          <AppIcon name="arrow-right" class="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
        </NuxtLink>
      </div>
      <div class="space-y-3">
        <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">最新资源</p>
        <NuxtLink
          v-for="item in resources"
          :key="item.id"
          :to="`/nav/${item.categorySlug}`"
          class="card card-hover flex items-start justify-between gap-4 p-4"
        >
          <div>
            <p class="text-sm font-medium text-zinc-900 dark:text-zinc-50">{{ item.name }}</p>
            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{{ item.categoryName }}</p>
          </div>
          <AppIcon name="arrow-right" class="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { NavigationCategory } from '~/types/navigation'

defineProps<{
  category: NavigationCategory
}>()
</script>

<template>
  <NuxtLink
    :to="`/nav/${category.slug}`"
    class="card card-hover flex h-full flex-col p-5"
  >
    <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-accent dark:border-white/10">
      <AppIcon :name="category.icon" class="h-5 w-5" />
    </span>
    <h3 class="mt-5 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
      {{ category.name }}
    </h3>
    <p class="mt-2 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
      {{ category.description }}
    </p>
    <div class="mt-5 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
      <span>{{ category.items.length }} 个资源</span>
      <span class="inline-flex items-center gap-1 text-zinc-900 dark:text-zinc-100">
        查看
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </span>
    </div>
  </NuxtLink>
</template>

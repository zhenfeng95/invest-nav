<script setup lang="ts">
defineProps<{
  index: string
  title: string
  description: string
  to: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="card card-hover group flex min-h-[220px] flex-col p-6 sm:p-7"
  >
    <span class="text-xs font-medium tracking-[0.18em] text-zinc-400">{{ index }}</span>
    <h3 class="mt-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
      {{ title }}
    </h3>
    <p class="mt-3 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
      {{ description }}
    </p>
    <span class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 transition group-hover:gap-2.5 dark:text-zinc-100">
      查看资源
      <AppIcon name="arrow-right" class="h-4 w-4" />
    </span>
  </NuxtLink>
</template>

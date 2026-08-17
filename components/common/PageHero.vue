<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="max-w-2xl">
    <p
      v-if="eyebrow"
      class="text-xs font-medium uppercase tracking-[0.18em] text-accent"
    >
      {{ eyebrow }}
    </p>
    <h1 class="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="mt-4 text-sm leading-7 text-zinc-500 sm:text-base dark:text-zinc-400"
    >
      {{ description }}
    </p>
  </div>
</template>

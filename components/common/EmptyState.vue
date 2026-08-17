<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>(), {
  eyebrow: 'Coming Soon',
})
</script>

<template>
  <div class="card px-6 py-12 text-center sm:px-10">
    <p class="text-xs font-medium uppercase tracking-[0.18em] text-accent">{{ eyebrow }}</p>
    <h2 class="mt-3 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400"
    >
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ToolGuide } from '~/types/tool-guide'

defineProps<{
  guide: ToolGuide
}>()
</script>

<template>
  <section class="space-y-10 border-t border-zinc-200/80 pt-10 dark:border-white/10">
    <div class="space-y-4">
      <h2 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        怎么用
      </h2>
      <div class="max-w-3xl space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
        <p
          v-for="(paragraph, index) in guide.howTo"
          :key="`how-${index}`"
        >
          {{ paragraph }}
        </p>
      </div>
      <ol
        v-if="guide.steps?.length"
        class="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base"
      >
        <li
          v-for="(step, index) in guide.steps"
          :key="`step-${index}`"
        >
          {{ step }}
        </li>
      </ol>
    </div>

    <div class="space-y-4">
      <h2 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        假设与局限
      </h2>
      <ul class="max-w-3xl list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
        <li
          v-for="(item, index) in guide.assumptions"
          :key="`assume-${index}`"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="space-y-4">
      <h2 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        常见问题
      </h2>
      <div class="max-w-3xl divide-y divide-zinc-200/80 rounded-2xl border border-zinc-200 dark:divide-white/10 dark:border-white/10">
        <details
          v-for="(item, index) in guide.faq"
          :key="`faq-${index}`"
          class="group px-4 py-3 sm:px-5"
        >
          <summary
            class="cursor-pointer list-none text-sm font-medium text-zinc-900 marker:content-none dark:text-zinc-50 sm:text-base [&::-webkit-details-marker]:hidden"
          >
            <span class="flex items-start justify-between gap-3">
              <span>{{ item.question }}</span>
              <span
                class="mt-0.5 shrink-0 text-zinc-400 transition group-open:rotate-45"
                aria-hidden="true"
              >+</span>
            </span>
          </summary>
          <p class="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            {{ item.answer }}
          </p>
        </details>
      </div>
    </div>
  </section>
</template>

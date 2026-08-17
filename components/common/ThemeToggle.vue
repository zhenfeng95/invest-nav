<script setup lang="ts">
const colorMode = useColorMode()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

const options = [
  { value: 'light', label: '浅色', icon: 'sun' as const },
  { value: 'dark', label: '深色', icon: 'moon' as const },
  { value: 'system', label: '系统', icon: 'monitor' as const },
]

const currentIcon = computed(() => {
  if (colorMode.preference === 'system') {
    return 'monitor'
  }
  return colorMode.value === 'dark' ? 'moon' : 'sun'
})

function setMode(value: string) {
  colorMode.preference = value
  open.value = false
}

function onClickOutside(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
      :aria-expanded="open"
      aria-label="切换主题"
      @click="open = !open"
    >
      <AppIcon :name="currentIcon" class="h-4 w-4" />
    </button>

    <div
      v-if="open"
      class="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-1 shadow-card dark:border-white/10 dark:bg-[#14171C]"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
        :class="colorMode.preference === option.value ? 'bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white' : ''"
        @click="setMode(option.value)"
      >
        <AppIcon :name="option.icon" class="h-4 w-4" />
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

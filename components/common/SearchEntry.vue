<script setup lang="ts">
const open = ref(false)

function close() {
  open.value = false
}

watch(open, (value) => {
  if (!import.meta.client) {
    return
  }
  document.body.style.overflow = value ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div>
    <button
      type="button"
      class="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
      aria-label="搜索"
      @click="open = true"
    >
      <AppIcon name="search" class="h-4 w-4" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-[70] flex items-start justify-center bg-zinc-950/40 px-4 pt-24 backdrop-blur-sm dark:bg-black/50"
        @click.self="close"
      >
        <div class="card w-full max-w-lg p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-zinc-900 dark:text-zinc-50">搜索</p>
              <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">搜索功能即将开放，第一阶段仅预留入口。</p>
            </div>
            <button
              type="button"
              class="focus-ring rounded-full p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              aria-label="关闭搜索"
              @click="close"
            >
              <AppIcon name="close" class="h-4 w-4" />
            </button>
          </div>
          <div class="mt-4 rounded-xl border border-dashed border-zinc-200 px-3 py-3 text-sm text-zinc-400 dark:border-white/10">
            输入关键词查找教程、工具与导航资源
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

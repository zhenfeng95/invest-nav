<script setup lang="ts">
import type { SearchResult } from '~/utils/search'
import { groupSearchResults, searchSite } from '~/utils/search'

const open = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const results = computed(() => searchSite(query.value))
const grouped = computed(() => groupSearchResults(results.value))
const flatResults = computed(() => results.value)

watch(query, () => {
  activeIndex.value = 0
})

watch(open, async (value) => {
  if (!import.meta.client) {
    return
  }
  document.body.style.overflow = value ? 'hidden' : ''
  if (value) {
    query.value = ''
    activeIndex.value = 0
    await nextTick()
    inputRef.value?.focus()
  }
})

function close() {
  open.value = false
}

function openSearch() {
  open.value = true
}

function selectResult(item: SearchResult) {
  close()
  if (item.to) {
    navigateTo(item.to)
    return
  }
  if (item.href && import.meta.client) {
    window.open(item.href, '_blank', 'noopener,noreferrer')
  }
}

function moveActive(delta: number) {
  const total = flatResults.value.length
  if (!total) {
    activeIndex.value = 0
    return
  }
  activeIndex.value = (activeIndex.value + delta + total) % total
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
    return
  }
  if (event.key === 'Enter') {
    const item = flatResults.value[activeIndex.value]
    if (item) {
      event.preventDefault()
      selectResult(item)
    }
    return
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function flatIndexOf(item: SearchResult) {
  return flatResults.value.findIndex(entry => entry.id === item.id)
}

function onGlobalKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', onGlobalKeydown)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onGlobalKeydown)
  }
})
</script>

<template>
  <div>
    <button
      type="button"
      class="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
      aria-label="搜索"
      title="搜索（⌘K）"
      @click="openSearch"
    >
      <AppIcon name="search" class="h-4 w-4" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-[70] flex items-start justify-center bg-zinc-950/40 px-4 pt-[12vh] backdrop-blur-sm dark:bg-black/50"
        @click.self="close"
      >
        <div
          class="card flex max-h-[min(32rem,72vh)] w-full max-w-lg flex-col overflow-hidden p-0"
          role="dialog"
          aria-modal="true"
          aria-label="站内搜索"
        >
          <div class="flex items-center gap-3 border-b border-zinc-200/80 px-4 dark:border-white/[0.08]">
            <AppIcon name="search" class="h-4 w-4 shrink-0 text-zinc-400" />
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              class="h-12 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
              placeholder="搜索教程、工具、导航…"
              autocomplete="off"
              enterkeyhint="search"
              @keydown="onInputKeydown"
            >
            <button
              type="button"
              class="focus-ring shrink-0 rounded-full p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              aria-label="关闭搜索"
              @click="close"
            >
              <AppIcon name="close" class="h-4 w-4" />
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-2">
            <p
              v-if="!query.trim()"
              class="px-3 py-8 text-center text-sm text-zinc-400"
            >
              输入关键词，查找教程、工具与导航资源
            </p>

            <p
              v-else-if="!flatResults.length"
              class="px-3 py-8 text-center text-sm text-zinc-400"
            >
              没有找到「{{ query.trim() }}」相关结果
            </p>

            <div
              v-for="section in grouped"
              :key="section.group"
              class="mb-2 last:mb-0"
            >
              <p class="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                {{ section.label }}
              </p>
              <ul class="space-y-0.5">
                <li
                  v-for="item in section.items"
                  :key="item.id"
                >
                  <button
                    type="button"
                    class="flex w-full flex-col rounded-[6px] px-3 py-2.5 text-left transition"
                    :class="flatIndexOf(item) === activeIndex
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5'"
                    @click="selectResult(item)"
                    @mouseenter="activeIndex = flatIndexOf(item)"
                  >
                    <span class="flex items-center justify-between gap-3">
                      <span class="truncate text-sm font-medium">{{ item.title }}</span>
                      <span
                        v-if="item.meta"
                        class="shrink-0 text-[11px] opacity-60"
                      >
                        {{ item.meta }}
                      </span>
                    </span>
                    <span
                      class="mt-0.5 line-clamp-1 text-xs opacity-60"
                    >
                      {{ item.description }}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div class="flex items-center gap-3 border-t border-zinc-200/80 px-4 py-2.5 text-[11px] text-zinc-400 dark:border-white/[0.08]">
            <span>↑↓ 选择</span>
            <span>↵ 打开</span>
            <span>Esc 关闭</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

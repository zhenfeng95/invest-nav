<script setup lang="ts">
import {
  getGroupedNavigationCategories,
  getNavigationPath,
  getNavigationShortDescription,
  navigationGroups,
} from '~/utils/navigation'

const route = useRoute()
const groups = getGroupedNavigationCategories()

const activeGroupId = computed(() => {
  const query = String(route.query.group || '')
  if (navigationGroups.some(group => group.id === query)) {
    return query
  }
  return navigationGroups[0]?.id ?? 'markets'
})

const activeGroup = computed(
  () => groups.find(group => group.id === activeGroupId.value) ?? groups[0],
)

function tabTo(groupId: string) {
  return {
    path: '/nav',
    query: { group: groupId },
  }
}

function isTabActive(groupId: string) {
  return activeGroupId.value === groupId
}

function cardIndex(index: number) {
  return String(index + 1).padStart(2, '0')
}

usePageSeo({
  title: '全部导航',
  description: '按分类浏览 Zhen Invest 投资导航：美股、基金、ETF、个股、期权、香港银行、美股券商、资金流转、数字基建与出入金资源，不确定的官方链接会明确标注，避免误导。',
  path: '/nav',
})
</script>

<template>
  <AppContainer class="space-y-10 py-12 sm:py-16">
    <PageHero
      eyebrow="Navigation"
      title="全部导航"
      description="先选主题，再进入分类查看相关教程与资源整理。"
    />

    <div class="-mx-4 overflow-x-auto px-4">
      <div
        class="inline-flex min-w-max gap-2 rounded-full border border-zinc-200/80 bg-white p-1 dark:border-white/10 dark:bg-white/[0.03]"
      >
        <NuxtLink
          v-for="group in navigationGroups"
          :key="group.id"
          :to="tabTo(group.id)"
          class="rounded-full px-4 py-2 text-sm transition"
          :class="
            isTabActive(group.id)
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
          "
        >
          {{ group.title }}
        </NuxtLink>
      </div>
    </div>

    <div v-if="activeGroup" class="space-y-6">
      <p class="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {{ activeGroup.description }}
      </p>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <EntryCard
          v-for="(category, index) in activeGroup.categories"
          :key="category.id"
          :index="cardIndex(index)"
          :title="category.name"
          :description="getNavigationShortDescription(category.slug)"
          :to="getNavigationPath(category.slug)"
        />
      </div>
    </div>
  </AppContainer>
</template>

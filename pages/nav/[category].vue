<script setup lang="ts">
import {
  getNavigationCategory,
  getNavigationGroupIdForSlug,
  getNavigationGroupPath,
  getTutorialCategoriesForNavSlug,
} from '~/utils/navigation'
import { getTutorialsByCategories } from '~/utils/tutorials'

const route = useRoute()
const slug = String(route.params.category)
const category = getNavigationCategory(slug)

if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: '分类不存在',
  })
}

const displayTitle = category.fullName || category.name
const groupId = getNavigationGroupIdForSlug(slug)
const backTo = groupId ? getNavigationGroupPath(groupId) : '/nav'
const tutorials = getTutorialsByCategories(getTutorialCategoriesForNavSlug(slug))

usePageSeo({
  title: displayTitle,
  description: category.description,
  path: `/nav/${category.slug}`,
})
</script>

<template>
  <AppContainer v-if="category" class="space-y-12 py-12 sm:py-16">
    <div>
      <NuxtLink
        :to="backTo"
        class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
      >
        返回导航
      </NuxtLink>
      <PageHero
        class="mt-6"
        eyebrow="Category"
        :title="displayTitle"
        :description="category.description"
      />
      <p class="mt-3 text-sm text-zinc-400">
        {{ category.items.length }} 个资源 · {{ tutorials.length }} 篇教程
      </p>
    </div>

    <section class="space-y-6">
      <SectionTitle
        title="资源入口"
        description="官方与常用研究站点，不确定的链接会标注待确认。"
      />
      <NavigationList :items="category.items" />
    </section>

    <section class="space-y-6">
      <SectionTitle
        title="相关教程"
        description="与本分类相关的站内文字与一图看懂整理。"
      />
      <NavigationArticleList :items="tutorials" />
    </section>
  </AppContainer>
</template>

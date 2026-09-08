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
  <AppContainer v-if="category" class="space-y-10 py-12 sm:py-16">
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
        {{ tutorials.length }} 篇教程
      </p>
    </div>

    <NavigationArticleList :items="tutorials" />
  </AppContainer>
</template>

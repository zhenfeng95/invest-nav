<script setup lang="ts">
import { getNavigationCategory } from '~/utils/navigation'

const route = useRoute()
const slug = String(route.params.category)
const category = getNavigationCategory(slug)

if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: '分类不存在',
  })
}

usePageSeo({
  title: category.name,
  description: category.description,
  path: `/nav/${category.slug}`,
})
</script>

<template>
  <AppContainer v-if="category" class="space-y-10 py-12 sm:py-16">
    <div>
      <NuxtLink
        to="/nav"
        class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
      >
        返回导航
      </NuxtLink>
      <PageHero
        class="mt-6"
        eyebrow="Category"
        :title="category.name"
        :description="category.description"
      />
    </div>
    <NavigationList :items="category.items" />
  </AppContainer>
</template>

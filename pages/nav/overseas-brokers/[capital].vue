<script setup lang="ts">
import {
  getBrokerCapitalGroup,
  getBrokerCapitalItems,
  getBrokerCapitalPath,
} from '~/utils/navigation'
import { getTutorialMetaBySlug } from '~/utils/tutorial-meta'
import type { Tutorial } from '~/types/tutorial'

const route = useRoute()
const capital = String(route.params.capital)
const group = getBrokerCapitalGroup(capital)

if (!group) {
  throw createError({
    statusCode: 404,
    statusMessage: '分类不存在',
  })
}

const items = getBrokerCapitalItems(group)
const tutorials = group.tutorialSlugs
  .map(slug => getTutorialMetaBySlug(slug))
  .filter((item): item is Tutorial => Boolean(item))

usePageSeo({
  title: group.label,
  description: group.description,
  path: getBrokerCapitalPath(group.id),
})
</script>

<template>
  <AppContainer v-if="group" class="space-y-12 py-12 sm:py-16">
    <div>
      <PageHero
        eyebrow="Brokers"
        :title="group.label"
        :description="group.description"
      />
      <p class="mt-3 text-sm text-zinc-400">
        {{ items.length }} 个资源 · {{ tutorials.length }} 篇教程
      </p>
    </div>

    <section class="space-y-6">
      <SectionTitle
        title="资源入口"
        description="官方与常用开户入口，不确定的链接会标注待确认。"
      />
      <NavigationList :items="items" />
    </section>

    <section class="space-y-6">
      <SectionTitle
        title="相关教程"
        description="与本组券商直接相关的站内开户教程。"
      />
      <NavigationArticleList :items="tutorials" />
    </section>
  </AppContainer>
</template>

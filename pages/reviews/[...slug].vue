<script setup lang="ts">
const route = useRoute()
const slug = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? value.join('/') : String(value || '')
})

// 旧链接 /reviews/:slug → /reviews/monthly/:slug
// monthly / weekly 由 pages/reviews/{monthly,weekly} 承接，不应落到这里
const first = slug.value.split('/')[0]
if (first === 'monthly' || first === 'weekly') {
  throw createError({ statusCode: 404, statusMessage: '页面不存在' })
}

await navigateTo(`/reviews/monthly/${slug.value}`, { redirectCode: 301 })
</script>

<template>
  <div />
</template>

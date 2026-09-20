<script setup lang="ts">
import { SITE_CONTACT_EMAIL, SITE_NAME } from '~/utils/site'

usePageSeo({
  title: '联系我们｜反馈勘误与资源补充',
  description: `通过公开邮箱联系 ${SITE_NAME}：反馈链接失效、内容勘误、资源补充或站点相关问题。我们不提供投资建议、代办开户或资金操作服务，请以各机构官方说明为准。`,
  path: '/contact',
})
</script>

<template>
  <AppContainer class="py-12 sm:py-16">
    <article class="max-w-2xl">
      <PageHero
        eyebrow="Contact"
        title="联系我们"
        description="欢迎通过公开邮箱反馈勘误、失效链接或站点相关问题。我们会尽量在合理时间内回复。"
      />
      <div class="mt-10 space-y-8 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">公开邮箱</h2>
          <p>
            <a
              :href="`mailto:${SITE_CONTACT_EMAIL}`"
              class="text-base font-medium text-accent underline-offset-2 hover:underline"
            >{{ SITE_CONTACT_EMAIL }}</a>
          </p>
          <p>
            请尽量在邮件主题中写明事由（例如「链接失效」「教程勘误」「隐私问题」），并附上对应页面链接，方便我们核对。
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">适合联系的事项</h2>
          <ul class="list-disc space-y-2 pl-5">
            <li>教程、导航或工具中的事实错误、过时步骤与截图失效</li>
            <li>官方链接变更、页面打不开或跳转异常</li>
            <li>隐私政策、免责声明或站点使用相关的疑问</li>
            <li>善意的内容补充建议（我们可能采纳，但不承诺逐条回复实现进度）</li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">我们无法提供的协助</h2>
          <ul class="list-disc space-y-2 pl-5">
            <li>投资建议、买卖点、仓位指导或收益承诺</li>
            <li>代开户、代操作、资金路径「包办」或违规绕行方案</li>
            <li>各机构账户审核进度查询（请直接联系对应官方客服）</li>
            <li>与本站无关的私人事务或紧急求助</li>
          </ul>
          <p>
            内容边界见
            <NuxtLink to="/disclaimer" class="text-accent underline-offset-2 hover:underline">免责声明</NuxtLink>
            与
            <NuxtLink to="/about" class="text-accent underline-offset-2 hover:underline">关于我们</NuxtLink>。
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">回复说明</h2>
          <p>
            本站由个人维护，通常会在数个工作日内查看邮箱；高峰期或信息不全时可能更慢，或需要你补充细节后再回复。
            我们不保证对每封邮件都逐一回复，但会优先处理事实勘误与安全相关问题。
          </p>
        </section>
      </div>
    </article>
  </AppContainer>
</template>

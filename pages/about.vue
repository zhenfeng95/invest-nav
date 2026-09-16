<script setup lang="ts">
import { siteAuthor } from '~/data/author'
import { SITE_CONTACT_EMAIL, SITE_NAME, SITE_URL } from '~/utils/site'

usePageSeo({
  title: '关于我们',
  description: `${SITE_NAME} 由 ${siteAuthor.name} 维护：介绍站长、创站初衷，以及港美股与跨境投资教程、导航与工具的定位与内容边界。`,
  path: '/about',
})

const author = siteAuthor

function socialHref(url: string) {
  return url.trim() || undefined
}

const communityHref = computed(() => socialHref(author.communityUrl))
</script>

<template>
  <AppContainer class="py-12 sm:py-16">
    <div class="mx-auto max-w-4xl space-y-6">
      <section class="card p-6 sm:p-8">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <img
            :src="author.avatar"
            :alt="`${author.name} 头像`"
            width="112"
            height="112"
            class="h-24 w-24 shrink-0 rounded-full border border-zinc-200 object-cover dark:border-white/10 sm:h-28 sm:w-28"
          >
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium uppercase tracking-[0.18em] text-accent">
              About
            </p>
            <h1 class="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              {{ author.name }}
            </h1>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="tag in author.tags"
                :key="tag"
                class="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
              >
                {{ tag }}
              </span>
            </div>
            <div class="mt-5 space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
              <p v-for="bio in author.bios" :key="bio">
                {{ bio }}
              </p>
              <p>
                可通过
                <span class="font-medium text-accent">Telegram</span>
                或发邮件至
                <a
                  :href="`mailto:${SITE_CONTACT_EMAIL}`"
                  class="font-medium text-accent underline-offset-2 hover:underline"
                >{{ SITE_CONTACT_EMAIL }}</a>
                联系。社交与交流群链接仍在完善中。
              </p>
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
              <a
                v-for="social in author.socials"
                :key="social.id"
                :href="socialHref(social.url) || '#'"
                :target="socialHref(social.url) ? '_blank' : undefined"
                :rel="socialHref(social.url) ? 'noopener noreferrer' : undefined"
                :aria-disabled="!socialHref(social.url)"
                :class="[
                  'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition',
                  socialHref(social.url)
                    ? 'border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/5'
                    : 'cursor-not-allowed border-zinc-200/70 text-zinc-400 dark:border-white/10 dark:text-zinc-500',
                ]"
                @click="!socialHref(social.url) && $event.preventDefault()"
              >
                <AppIcon :name="social.id" class="h-4 w-4" />
                <span>{{ social.label }}</span>
                <span v-if="!socialHref(social.url)" class="text-xs">待完善</span>
                <AppIcon v-else name="external" class="h-3.5 w-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-2">
        <section class="card p-6 sm:p-7">
          <h2 class="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            <AppIcon name="target" class="h-5 w-5 text-accent" />
            创站初衷
          </h2>
          <ul class="mt-5 space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            <li
              v-for="item in author.intents"
              :key="item"
              class="flex gap-2"
            >
              <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <section class="card flex flex-col p-6 sm:p-7">
          <h2 class="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            <AppIcon name="chat" class="h-5 w-5 text-accent" />
            用户交流群
          </h2>
          <ul class="mt-5 space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            <li
              v-for="topic in author.communityTopics"
              :key="topic.text"
              class="flex items-center gap-2.5"
            >
              <AppIcon :name="topic.icon" class="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
              <span>{{ topic.text }}</span>
            </li>
          </ul>
          <a
            :href="communityHref || '#'"
            :target="communityHref ? '_blank' : undefined"
            :rel="communityHref ? 'noopener noreferrer' : undefined"
            :aria-disabled="!communityHref"
            :class="[
              'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition',
              communityHref
                ? 'border-zinc-200 text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-100 dark:hover:border-white/20 dark:hover:bg-white/5'
                : 'cursor-not-allowed border-zinc-200/70 text-zinc-400 dark:border-white/10 dark:text-zinc-500',
            ]"
            @click="!communityHref && $event.preventDefault()"
          >
            <AppIcon name="telegram" class="h-4 w-4" />
            <span>{{ author.communityCta }}</span>
            <span v-if="!communityHref" class="text-xs font-normal">待完善</span>
          </a>
        </section>
      </div>

      <article class="card space-y-8 p-6 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:p-8 sm:text-base">
        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">这个站点在做什么</h2>
          <p>
            跨境开户、出入金和资金路径信息分散在各机构官网、App 与社区讨论里，更新快、口径也不统一。
            {{ SITE_NAME }} 把这些公开资料整理成可对照的教程与分类导航，帮你更快判断「下一步该看什么、去哪里核实」。
          </p>
          <p>站点目前主要提供：</p>
          <ul class="list-disc space-y-2 pl-5">
            <li>港美股、香港银行、资金流转、数字基建等主题的图文教程</li>
            <li>按分类整理的官方资源导航（券商、银行、SIM、基建等）</li>
            <li>少量计算器与日历类轻量工具</li>
            <li>站长个人投研复盘（持仓、日/周/月复盘），用于学习记录，不代表他人应跟随</li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">我们不是什么</h2>
          <ul class="list-disc space-y-2 pl-5">
            <li>不是持牌券商、银行、支付机构或投资顾问</li>
            <li>不提供代开户、代操作、资金托管或一对一理财服务</li>
            <li>不发布买卖点、荐股或承诺收益的内容</li>
            <li>不替代各机构官方披露、客服答复与你自己的合规判断</li>
          </ul>
          <p>
            更完整的边界说明见
            <NuxtLink to="/disclaimer" class="text-accent underline-offset-2 hover:underline">免责声明</NuxtLink>。
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">内容如何产生</h2>
          <p>
            教程以官方文档、产品界面与实际操作流程为主要依据，并尽可能配上截图与步骤说明。
            机构政策、页面文案、费用与审核规则会变化，文中也会提醒以官网当时显示为准。
          </p>
          <p>
            若文中提及邀请码、推荐链接或其他可能存在利益关系的信息，我们会尽量在对应页面注明；你仍应自行核实条款，并按自身情况决定是否使用。
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">运营与联系</h2>
          <p>
            本站由个人维护，域名 {{ SITE_URL.replace(/^https?:\/\//, '') }}。
            如发现链接失效、信息过时或内容勘误，欢迎通过
            <NuxtLink to="/contact" class="text-accent underline-offset-2 hover:underline">联系我们</NuxtLink>
            页的公开邮箱反馈。
          </p>
          <p>
            隐私相关说明见
            <NuxtLink to="/privacy" class="text-accent underline-offset-2 hover:underline">隐私政策</NuxtLink>；
            日常联系：
            <a
              :href="`mailto:${SITE_CONTACT_EMAIL}`"
              class="text-accent underline-offset-2 hover:underline"
            >{{ SITE_CONTACT_EMAIL }}</a>。
          </p>
        </section>
      </article>
    </div>
  </AppContainer>
</template>

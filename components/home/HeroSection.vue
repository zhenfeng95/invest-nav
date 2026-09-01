<script setup lang="ts">
function scrollToContent() {
    if (!import.meta.client) {
        return;
    }
    document.getElementById('home-content')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
    <section
        class="hero-screen relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6"
    >
        <div class="hero-waves pointer-events-none absolute inset-x-0 bottom-0 h-40 sm:h-52" aria-hidden="true">
            <svg class="absolute inset-0 h-full w-full" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none">
                <path
                    d="M0 140 C180 100 320 170 500 130 C680 90 820 160 1000 120 C1180 80 1320 150 1440 110 L1440 200 L0 200 Z"
                    stroke="rgba(255,255,255,0.08)"
                    stroke-width="1"
                    fill="rgba(255,255,255,0.02)"
                />
                <path
                    d="M0 160 C220 120 360 180 560 145 C760 110 900 175 1100 140 C1260 115 1360 155 1440 135 L1440 200 L0 200 Z"
                    stroke="rgba(234,179,8,0.12)"
                    stroke-width="1"
                    fill="rgba(234,179,8,0.03)"
                />
                <path
                    d="M0 175 C200 155 400 190 640 165 C880 140 1100 185 1440 160 L1440 200 L0 200 Z"
                    stroke="rgba(255,255,255,0.06)"
                    stroke-width="1"
                    fill="none"
                />
            </svg>
        </div>

        <div class="hero-content relative z-10 mx-auto flex max-w-3xl flex-col items-center">
            <h1 class="mt-8 font-serif text-6xl font-bold leading-[1.05] tracking-tight sm:mt-10 sm:text-7xl lg:text-8xl">
                <span class="block text-white">Zhen</span>
                <span class="mt-1 block text-amber-400 sm:mt-2">Invest</span>
            </h1>

            <p class="mt-8 max-w-md text-base leading-8 text-zinc-200 sm:mt-10 sm:text-lg sm:leading-9">
                跨境投资入口 · 港美股 / 加密 / 开户教程
            </p>
            <p class="mt-4 max-w-md text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
                内地用户的港美股与跨境投资入口，让跨境投资更简单。
            </p>

            <div class="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-12 sm:gap-4">
                <NuxtLink
                    to="/tutorials"
                    class="focus-ring inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_28px_rgba(251,191,36,0.35)] transition hover:bg-amber-300 hover:shadow-[0_0_36px_rgba(251,191,36,0.45)]"
                >
                    查看教程
                </NuxtLink>
                <NuxtLink
                    to="/nav"
                    class="focus-ring inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-medium text-zinc-100 transition hover:border-white/40 hover:bg-white/5"
                >
                    浏览导航
                </NuxtLink>
            </div>
        </div>

        <button
            type="button"
            class="hero-scroll absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/50 transition hover:text-white/80"
            aria-label="向下滚动"
            @click="scrollToContent"
        >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 7.5 L10 12.5 L15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
    </section>
</template>

<style scoped>
.hero-screen {
    background:
        radial-gradient(ellipse 70% 55% at 72% 78%, rgba(210, 165, 80, 0.16), transparent 58%),
        radial-gradient(ellipse 50% 40% at 30% 20%, rgba(255, 255, 255, 0.08), transparent 55%),
        linear-gradient(180deg, #2a303a 0%, #343b47 48%, #2e3440 100%);
    color: #f4f4f5;
}

.hero-content {
    animation: hero-rise 0.9s ease-out both;
}

.hero-badge {
    animation: hero-rise 0.9s ease-out 0.05s both;
}

.hero-scroll {
    animation: hero-bob 2.2s ease-in-out infinite;
}

@keyframes hero-rise {
    from {
        opacity: 0;
        transform: translateY(14px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes hero-bob {
    0%,
    100% {
        transform: translate(-50%, 0);
        opacity: 0.45;
    }
    50% {
        transform: translate(-50%, 6px);
        opacity: 0.85;
    }
}

@media (prefers-reduced-motion: reduce) {
    .hero-content,
    .hero-badge,
    .hero-scroll {
        animation: none;
    }
}
</style>

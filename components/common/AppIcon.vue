<script setup lang="ts">
export type IconName =
  | 'logo'
  | 'menu'
  | 'close'
  | 'search'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'arrow-right'
  | 'external'
  | 'book'
  | 'play'
  | 'image'
  | 'chart'
  | 'calendar'
  | 'calculator'
  | 'stocks'
  | 'funds'
  | 'etf'
  | 'company'
  | 'options'
  | 'bank'
  | 'broker'
  | 'transfer'
  | 'deposit'
  | 'sim'
  | 'infra'
  | 'report'
  | 'chevron-down'
  | 'x'
  | 'youtube'
  | 'telegram'
  | 'target'
  | 'chat'
  | 'megaphone'
  | 'bug'
  | 'lightbulb'

defineProps<{
  name: IconName
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <g v-if="name === 'logo'">
      <path d="M12 3.5 18 12l-6 8.5L6 12l6-8.5Z" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </g>
    <g v-else-if="name === 'menu'">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </g>
    <g v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6 6 18" />
    </g>
    <g v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.2-3.2" />
    </g>
    <g v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.5M12 19.5V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.5M19.5 12H21M4.9 19.1 6 18M18 6l1.1-1.1" />
    </g>
    <g v-else-if="name === 'moon'">
      <path d="M16.5 13.2A6.2 6.2 0 0 1 11 5.6 7 7 0 1 0 18.4 15a6.1 6.1 0 0 1-1.9-1.8Z" />
    </g>
    <g v-else-if="name === 'monitor'">
      <rect x="3.5" y="5" width="17" height="11.5" rx="1.8" />
      <path d="M8 20h8M12 16.5V20" />
    </g>
    <g v-else-if="name === 'arrow-right'">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </g>
    <g v-else-if="name === 'external'">
      <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5V14M14 5h5v5M13 11l6-6" />
    </g>
    <g v-else-if="name === 'book'">
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5Z" />
      <path d="M5 5.5v16" />
    </g>
    <g v-else-if="name === 'play'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m10 8.5 6 3.5-6 3.5V8.5Z" />
    </g>
    <g v-else-if="name === 'image'">
      <rect x="4" y="5.5" width="16" height="13" rx="2" />
      <circle cx="9" cy="10" r="1.4" />
      <path d="m8 16 3.2-3.2L15 16l1.4-1.4 3.6 3.4" />
    </g>
    <g v-else-if="name === 'chart'">
      <path d="M4 19h16M7 16V9M12 16V6M17 16v-4" />
    </g>
    <g v-else-if="name === 'calendar'">
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M8 3.8v3.2M16 3.8v3.2M4 10h16" />
    </g>
    <g v-else-if="name === 'calculator'">
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M8 8h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </g>
    <g v-else-if="name === 'stocks'">
      <path d="M4 16.5 9 11l3.5 3.5L20 7" />
      <path d="M14.5 7H20v5.5" />
    </g>
    <g v-else-if="name === 'funds'">
      <path d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z" />
      <path d="M12 12 20 8M12 12v8.5M12 12 4 8" />
    </g>
    <g v-else-if="name === 'etf'">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 14v-4M12 14V9M16 14v-2" />
    </g>
    <g v-else-if="name === 'company'">
      <circle cx="12" cy="8" r="2.4" />
      <path d="M6 19c.6-3 3-4.6 6-4.6S17.4 16 18 19" />
    </g>
    <g v-else-if="name === 'options'">
      <path d="M8 16.5a4 4 0 1 1 8 0" />
      <circle cx="12" cy="9.5" r="2.2" />
      <path d="M12 11.7V16" />
    </g>
    <g v-else-if="name === 'bank'">
      <path d="M4 10 12 5l8 5M6 10v8M12 10v8M18 10v8M4 18h16" />
    </g>
    <g v-else-if="name === 'broker'">
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M8 8V6.5A4 4 0 0 1 16 6.5V8" />
    </g>
    <g v-else-if="name === 'transfer'">
      <path d="M7 8h12l-3-3M17 16H5l3 3" />
    </g>
    <g v-else-if="name === 'deposit'">
      <path d="M12 4v10M8.5 10.5 12 14l3.5-3.5M5 18h14" />
    </g>
    <g v-else-if="name === 'sim'">
      <path d="M7 5.5h7.5L18 9v9.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" />
      <path d="M9.5 13.5h5M9.5 16h3.5" />
      <rect x="9.5" y="8" width="5" height="3.5" rx="0.6" />
    </g>
    <g v-else-if="name === 'infra'">
      <rect x="4" y="4" width="7" height="7" rx="1.4" />
      <rect x="13" y="4" width="7" height="7" rx="1.4" />
      <rect x="4" y="13" width="7" height="7" rx="1.4" />
      <path d="M16.5 13.5V16a1.5 1.5 0 0 0 1.5 1.5h2" />
      <path d="M13.5 16.5H16" />
    </g>
    <g v-else-if="name === 'report'">
      <path d="M7 4.5h7.5L19 9v10.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z" />
      <path d="M14.5 4.5V9H19" />
      <path d="M9 13h6M9 16.5h4" />
    </g>
    <g v-else-if="name === 'chevron-down'">
      <path d="m6 9 6 6 6-6" />
    </g>
    <g v-else-if="name === 'x'">
      <path d="M5 5l14 14M19 5 5 19" />
    </g>
    <g v-else-if="name === 'youtube'">
      <rect x="3.5" y="7" width="17" height="10" rx="2.5" />
      <path d="m11 10.2 4 1.8-4 1.8V10.2Z" fill="currentColor" stroke="none" />
    </g>
    <g v-else-if="name === 'telegram'">
      <path d="M20.5 5.5 3.8 12.2l4.6 1.6 1.7 4.7 2.9-3.2 4.2 2.7 3.3-12.5Z" />
      <path d="m8.4 13.8 8.7-6.2" />
    </g>
    <g v-else-if="name === 'target'">
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </g>
    <g v-else-if="name === 'chat'">
      <path d="M6 17.5 4.5 20l3.2-1.2A7.5 7.5 0 1 0 6 17.5Z" />
    </g>
    <g v-else-if="name === 'megaphone'">
      <path d="M4.5 11.5v2A1.5 1.5 0 0 0 6 15h1l6 3.5V6.5L7 10H6a1.5 1.5 0 0 0-1.5 1.5Z" />
      <path d="M17.5 9.5a3.2 3.2 0 0 1 0 5" />
      <path d="M7 15.2V17a1.5 1.5 0 0 0 2.3 1.3" />
    </g>
    <g v-else-if="name === 'bug'">
      <path d="M8.5 9.5A3.5 3.5 0 0 1 15.5 9.5V14a3.5 3.5 0 0 1-7 0V9.5Z" />
      <path d="M9 7.5 7.5 6M15 7.5 16.5 6M5.5 12H8M16 12h2.5M5.5 16 8 15M18.5 16 16 15" />
    </g>
    <g v-else-if="name === 'lightbulb'">
      <path d="M9.5 16h5M10 18.5h4" />
      <path d="M9 14.5c-1.7-1-2.8-2.8-2.8-4.8A5.8 5.8 0 0 1 12 4a5.8 5.8 0 0 1 5.8 5.7c0 2-1.1 3.8-2.8 4.8L14.5 16h-5l-.5-1.5Z" />
    </g>
  </svg>
</template>

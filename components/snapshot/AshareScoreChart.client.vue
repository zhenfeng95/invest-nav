<script setup lang="ts">
import { BarChart, ScatterChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsType } from 'echarts/core'
import type { AshareSnapshotRow } from '~/types/snapshot'
import {
  ATTACK_OK_COLOR,
  snapshotDayLabel,
  snapshotTooltipRows,
  strategyColor,
} from '~/utils/snapshot'

echarts.use([BarChart, ScatterChart, GridComponent, TooltipComponent, DataZoomComponent, CanvasRenderer])

const props = defineProps<{
  items: AshareSnapshotRow[]
}>()

const emit = defineEmits<{
  hover: [index: number | null]
}>()

const colorMode = useColorMode()
const chartEl = ref<HTMLDivElement | null>(null)
const ready = ref(false)

let chart: EChartsType | null = null
let resizeObserver: ResizeObserver | null = null

const isDark = computed(() => colorMode.value === 'dark')

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function shortDate(value: string) {
  const match = value.match(/^\d{4}-(\d{2})-(\d{2})$/)
  if (!match) {
    return value
  }
  return `${Number(match[1])}/${Number(match[2])}`
}

function tooltipHtml(item: AshareSnapshotRow) {
  const dark = isDark.value
  const titleColor = dark ? '#fafafa' : '#18181b'
  const labelColor = dark ? '#a1a1aa' : '#71717a'
  const valueColor = dark ? '#f4f4f5' : '#27272a'
  const rows = snapshotTooltipRows(item)
    .map(row => `
      <div style="display:flex;gap:12px;justify-content:space-between;align-items:flex-start;margin-top:8px;">
        <span style="color:${labelColor};flex:none;">${escapeHtml(row.label)}</span>
        <span style="color:${valueColor};text-align:right;max-width:220px;white-space:normal;line-height:1.45;">${escapeHtml(row.value)}</span>
      </div>
    `)
    .join('')

  return `
    <div style="min-width:216px;max-width:300px;font-size:12px;">
      <div style="font-weight:600;color:${titleColor};">${escapeHtml(snapshotDayLabel(item.date))}</div>
      ${rows}
    </div>
  `
}

const DEFAULT_VISIBLE_DAYS = 15

function zoomRange(items: AshareSnapshotRow[]) {
  const count = items.length
  const visible = Math.min(count, DEFAULT_VISIBLE_DAYS)
  const startIndex = Math.max(0, count - visible)
  return {
    startValue: startIndex,
    endValue: Math.max(0, count - 1),
  }
}

function buildOption() {
  const items = props.items
  const dark = isDark.value
  const axisColor = dark ? '#a1a1aa' : '#71717a'
  const lineColor = dark ? 'rgba(255,255,255,0.10)' : '#e4e4e7'
  const splitColor = dark ? 'rgba(255,255,255,0.06)' : '#f4f4f5'
  const zoom = zoomRange(items)

  return {
    animationDuration: 360,
    grid: {
      top: 24,
      right: 8,
      left: 40,
      bottom: 52,
    },
    tooltip: {
      trigger: 'axis',
      z: 20,
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: dark ? 'rgba(255,255,255,0.06)' : 'rgba(24,24,27,0.06)',
        },
      },
      backgroundColor: dark ? '#18181b' : '#ffffff',
      borderColor: dark ? 'rgba(255,255,255,0.12)' : '#e4e4e7',
      borderWidth: 1,
      padding: [12, 14],
      extraCssText: 'border-radius:14px;box-shadow:0 8px 24px rgba(15,23,42,0.12);z-index:20;',
      confine: true,
      formatter: (params: unknown) => {
        const points = Array.isArray(params) ? params : [params]
        const point = points.find(entry => (
          typeof entry === 'object'
          && entry
          && 'seriesType' in entry
          && (entry as { seriesType?: string }).seriesType === 'bar'
        )) || points[0]
        const dataIndex = typeof point === 'object' && point && 'dataIndex' in point
          ? Number((point as { dataIndex?: number }).dataIndex)
          : -1
        const item = items[dataIndex]
        return item ? tooltipHtml(item) : ''
      },
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none',
        minValueSpan: Math.min(7, items.length),
        startValue: zoom.startValue,
        endValue: zoom.endValue,
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        height: 18,
        bottom: 8,
        borderColor: 'transparent',
        backgroundColor: dark ? 'rgba(255,255,255,0.04)' : '#f4f4f5',
        fillerColor: dark ? 'rgba(111,143,130,0.28)' : 'rgba(111,143,130,0.18)',
        handleSize: 18,
        handleStyle: {
          color: '#6F8F82',
          borderColor: '#6F8F82',
        },
        textStyle: {
          color: axisColor,
          fontSize: 10,
        },
        dataBackground: {
          lineStyle: { color: lineColor },
          areaStyle: { color: dark ? 'rgba(255,255,255,0.06)' : 'rgba(24,24,27,0.06)' },
        },
        selectedDataBackground: {
          lineStyle: { color: '#6F8F82' },
          areaStyle: { color: 'rgba(111,143,130,0.18)' },
        },
        brushSelect: false,
        startValue: zoom.startValue,
        endValue: zoom.endValue,
      },
    ],
    xAxis: {
      type: 'category',
      data: items.map(item => item.date),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: lineColor } },
      axisLabel: {
        color: axisColor,
        fontSize: 11,
        hideOverlap: true,
        formatter: (value: string) => shortDate(value),
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: axisColor,
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: splitColor,
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '市场评分',
        type: 'bar',
        barMaxWidth: 28,
        barCategoryGap: '32%',
        data: items.map(item => ({
          value: item.score,
          itemStyle: {
            color: strategyColor(item.strategy),
            borderRadius: [4, 4, 0, 0],
          },
        })),
        emphasis: {
          itemStyle: {
            opacity: 0.92,
          },
        },
      },
      {
        name: '进攻四条件',
        type: 'scatter',
        symbol: 'diamond',
        symbolSize: 9,
        symbolOffset: [0, -8],
        z: 10,
        data: items.map((item) => {
          if (!item.attackOk) {
            return null
          }
          return {
            value: item.score,
            itemStyle: {
              color: ATTACK_OK_COLOR,
              borderColor: dark ? '#18181b' : '#ffffff',
              borderWidth: 1,
            },
          }
        }),
        emphasis: {
          scale: 1.15,
          itemStyle: {
            color: ATTACK_OK_COLOR,
          },
        },
      },
    ],
  }
}

function resolveIndex(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && props.items[value]) {
    return value
  }
  if (typeof value === 'string') {
    const index = props.items.findIndex(item => item.date === value)
    return index >= 0 ? index : null
  }
  return null
}

function onAxisPointer(event: { axesInfo?: Array<{ value?: unknown }> }) {
  const index = resolveIndex(event.axesInfo?.[0]?.value)
  if (index != null) {
    emit('hover', index)
  }
}

function initChart() {
  if (!chartEl.value || chart) {
    return
  }

  try {
    chart = echarts.init(chartEl.value)
    chart.setOption(buildOption())
    chart.on('updateAxisPointer', onAxisPointer)
    chart.on('click', (params: { dataIndex?: number }) => {
      emit('hover', resolveIndex(params.dataIndex))
    })
    resizeObserver = new ResizeObserver(() => chart?.resize())
    resizeObserver.observe(chartEl.value)
    ready.value = true
  }
  catch (error) {
    console.error('[AshareScoreChart] init failed', error)
  }
}

function renderChart() {
  chart?.setOption(buildOption(), { notMerge: true })
}

watch(() => props.items, renderChart, { deep: true })
watch(isDark, renderChart)
watch(chartEl, (el) => {
  if (el) {
    initChart()
  }
})

onMounted(async () => {
  await nextTick()
  initChart()
})

onBeforeUnmount(() => {
  chart?.off('updateAxisPointer')
  chart?.off('click')
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
  resizeObserver = null
})
</script>

<template>
  <div class="relative h-[280px] w-full sm:h-[380px]">
    <div
      v-if="!ready"
      class="absolute inset-0 animate-pulse rounded-xl bg-zinc-100/80 dark:bg-white/5"
      aria-hidden="true"
    />
    <div
      ref="chartEl"
      class="h-full w-full"
      role="img"
      aria-label="A股每日市场评分柱状图，柱顶菱形表示当日满足进攻四条件"
    />
  </div>
</template>

export default defineEventHandler(() => {
  return {
    source: 'mock',
    updatedAt: '2026-08-17T00:00:00.000Z',
    message: 'Mock calendar data only. Replace this handler with a real provider later.',
    events: [
      { date: '2026-08-18', title: '示例：CPI 数据公布', region: 'US' },
      { date: '2026-08-20', title: '示例：FOMC 会议纪要', region: 'US' },
      { date: '2026-08-22', title: '示例：非农就业', region: 'US' },
    ],
  }
})

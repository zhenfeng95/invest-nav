export default defineEventHandler(() => {
  return {
    source: 'mock',
    updatedAt: '2026-08-17T00:00:00.000Z',
    message: 'Mock portfolio payload only. No real positions or calculations.',
    positions: [],
    summary: {
      currency: 'USD',
      marketValue: 0,
      dayChangePct: 0,
    },
  }
})

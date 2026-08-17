export default defineEventHandler(() => {
  return {
    source: 'mock',
    updatedAt: '2026-08-17T00:00:00.000Z',
    message: 'Mock QDII payload only. Do not treat these numbers as real quota data.',
    quota: {
      status: 'unknown',
      remaining: null,
      unit: 'USD',
    },
    funds: [],
  }
})

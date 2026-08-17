export default defineEventHandler(() => {
  return {
    source: 'mock',
    updatedAt: '2026-08-17T00:00:00.000Z',
    message: 'Mock crypto payload only. Replace this handler with a real provider later.',
    assets: [
      { symbol: 'BTC', name: 'Bitcoin', note: 'placeholder' },
      { symbol: 'ETH', name: 'Ethereum', note: 'placeholder' },
    ],
    airdrops: [],
  }
})

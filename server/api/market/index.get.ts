export default defineEventHandler(() => {
  return {
    source: 'mock',
    updatedAt: '2026-08-17T00:00:00.000Z',
    message: 'Mock market data only. Replace this handler with a real provider later.',
    items: [
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', note: 'placeholder' },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', note: 'placeholder' },
      { symbol: 'BTC', name: 'Bitcoin', note: 'placeholder' },
    ],
  }
})

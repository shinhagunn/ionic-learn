const apiUrl = 'https://demo.zsmartex.com'

export function getUrl(ws: boolean) {
  if (ws) {
    return globalThis.location.protocol === 'https:' ? `wss://${globalThis.location.host}/api/v2/websocket/` : `ws://${globalThis.location.host}/api/v2/websocket/`
  } else if (process.env.NODE_ENV === 'development') {
    return `http://${globalThis.location.host}/api/v2/`
  } else {
    return `${apiUrl}/api/v2/`
  }
}

export default {
  name: 'ZSmartex',
  default_market: 'ethusdt',
  default_chart_interval: '15',
  // default_chart_type: ChartType.Candles,
  home_page_feature_markets: ['ethusdt', 'btcusdt', 'bnbusdt', 'trxusdt', 'ethusdt'], // limit at 5
  markets_page_feature_markets: ['ethusdt', 'bnbusdt', 'trxusdt', 'btcusdt'], // limit at 4
  quote_list: ['usdt', 'eth', 'btc', 'bnb', 'trx', 'test1', 'test2'], // no limit
  api: {
    url: getUrl(false),
    ws: getUrl(true),
  },
}

export {
  apiUrl,
}

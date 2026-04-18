# NEXUS — AI Crypto Intelligence Dashboard

> Real-time cryptocurrency analytics powered by Binance WebSocket streams, CoinGecko REST API, and AI-driven technical analysis.
---

##  Features

### Real-Time Data
- **Binance WebSocket** — live price streaming for 15+ coins with instant UI updates
- **CoinGecko REST** — polling fallback every 15s, historical charts, market data
- **Auto-reconnect** — exponential backoff WebSocket reconnection logic
- **Live ticker tape** — scrolling real-time prices across the top of every page

### Dashboard
- Top 20 coins by market cap with sortable columns and search
- Global market stats (total market cap, BTC dominance, volume)
- Interactive price charts with 1H / 24H / 7D / 1M / 1Y ranges
- Sparkline mini-charts per coin
- Trending coins section (CoinGecko trending API)
- WebSocket connection status indicator

### Portfolio Tracker
- Add/remove holdings with buy price and amount
- Live P&L updates as prices stream in
- Portfolio allocation pie chart
- P&L Calculator — simulate any trade with live prices

### AI Insights
- **Signal detection** — STRONG BUY / BUY / NEUTRAL / SELL / STRONG SELL
- **RSI** — Relative Strength Index (overbought/oversold detection)
- **Moving Average crossovers** — SMA 7 vs SMA 25 trend direction
- **Volatility scoring** — risk score 1-10 based on price std deviation
- **Price prediction** — directional forecast with confidence score
- **Sentiment overview** — market-wide bullish/bearish distribution bar

### Coin Detail Pages
- Full historical chart with time range selector
- Complete market data (ATH, ATL, supply, volume)
- AI analysis panel per coin
- Links to official website and Twitter

---

## 🛠 Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Framework     | Next.js 14 (App Router)             |
| Language      | TypeScript                          |
| Styling       | Tailwind CSS                        |
| Animations    | Framer Motion                       |
| Charts        | Recharts                            |
| State         | Zustand                             |
| Data (Live)   | Binance WebSocket API               |
| Data (REST)   | CoinGecko API                       |
| HTTP Client   | Axios                               |
| Icons         | Lucide React                        |
| Fonts         | Bebas Neue · JetBrains Mono · Outfit|

---

## 📁 Project Structure

```
nexus-ai-crypto/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Redirect → /dashboard
│   ├── dashboard/              # Main dashboard page
│   ├── portfolio/              # Portfolio tracker page
│   ├── coins/                  # Markets list + coin detail [id]
│   ├── insights/               # AI Insights page
│   └── api/                    # Next.js API routes (proxy to CoinGecko)
│       ├── markets/
│       ├── coins/[id]/
│       │   └── history/
│       ├── trending/
│       ├── global/
│       └── insights/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky nav + live ticker tape
│   │   └── AppProvider.tsx     # Global data hook runner
│   ├── ui/
│   │   └── Card.tsx            # Card, Badge, Button, StatCard, Skeleton
│   ├── charts/
│   │   ├── PriceChart.tsx      # Area chart with time ranges
│   │   └── SparklineChart.tsx  # Mini sparkline for table rows
│   ├── dashboard/
│   │   ├── GlobalStats.tsx     # 4-stat market overview bar
│   │   ├── FeaturedChart.tsx   # Large chart with coin selector
│   │   ├── MarketTable.tsx     # Sortable/searchable coin table
│   │   ├── CoinRow.tsx         # Individual table row w/ live flash
│   │   └── TrendingCoins.tsx   # Trending sidebar
│   ├── portfolio/
│   │   ├── PortfolioSummary.tsx  # P&L summary + pie chart
│   │   ├── HoldingsTable.tsx     # Holdings management table
│   │   └── ProfitCalculator.tsx  # Trade simulator
│   └── insights/
│       └── InsightCard.tsx     # AI signal card
├── hooks/
│   ├── useWebSocket.ts         # Binance WS connection manager
│   ├── useMarketData.ts        # REST polling + Zustand sync
│   └── useLivePrice.ts         # WS-first price resolver per coin
├── services/
│   ├── coingecko.ts            # CoinGecko API client + retry logic
│   ├── binanceWS.ts            # WebSocket class + reconnect logic
│   └── aiEngine.ts             # RSI, SMA, volatility, signal generation
├── store/
│   └── useCryptoStore.ts       # Zustand global state
├── types/
│   └── index.ts                # All TypeScript interfaces
├── utils/
│   └── format.ts               # Price/percent/number formatters + coin metadata
└── styles/
    └── globals.css             # Tailwind + custom CSS (ticker, skeleton, flash)
```
---

## 🔌 Data Flow

```
Browser
  └─ useWebSocket()
       └─ BinanceWebSocket class
            └─ wss://stream.binance.com (15 coin streams)
                 └─ onmessage → updateLivePrice() → Zustand store
                                                        └─ CoinRow re-renders (flash)
                                                        └─ useLivePrice() hook
                                                        └─ Portfolio P&L updates

  └─ useMarketData() — polling every 15s
       └─ GET /api/markets → CoinGecko → setCoins()

  └─ PriceChart
       └─ GET /api/coins/{id}/history?range=7D → CoinGecko historical

  └─ AI Insights
       └─ generateInsights(coins) — pure local computation
            └─ RSI + SMA + Volatility → signal + risk score + prediction
```

---

## 🤖 AI Engine Details

The AI analysis is powered by classic technical analysis — no external AI API required:

| Indicator   | Method                                      |
|-------------|---------------------------------------------|
| Trend       | SMA(7) vs SMA(25) crossover                 |
| Momentum    | RSI(14) — overbought >70, oversold <30      |
| Volatility  | Std deviation of 7D price returns           |
| Volume      | Volume/MarketCap ratio classification       |
| Signal      | Combination of RSI + MA crossover           |
| Risk Score  | Weighted volatility + 24h price swing       |
| Prediction  | Linear regression on 7D prices × 0.5 factor|

---

## 📄 License

MIT — free to use, modify, and showcase in your portfolio.

---

*Built with Next.js, Tailwind CSS, Framer Motion, Recharts, Zustand, Binance WebSocket, and CoinGecko API.*

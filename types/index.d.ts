declare global {
  interface Activity {
    id: number
    user_ip: string
    user_ip_country: string
    user_agent: string
    topic: ActivityTopic
    action: string
    result: ActivityResult
    data: null
    created_at: string
  }

  interface APIKey {
    id: number
    label: string
    kid: string
    scope: string
    secret: string
    state: APIKeyState
    action: string
    loading: boolean
  }

  interface Banner {
    uuid: string
    image_url: string
    url: string
    type: string
  }

  interface Beneficiary {
    id: number
    address: string
    currency_id: string
    blockchain_key: string
    label: string
    description: string
    state: string
    created_at: string
    updated_at: string
  }

  interface CurrencyNetwork {
    id: number
    blockchain_key: string
    status: CurrencyNetworkStatus
    currency_id: string
    parent_id?: string
    deposit_enabled: boolean
    withdraw_enabled: boolean
    deposit_fee: string
    min_deposit_amount: string
    withdraw_fee: string
    min_withdraw_amount: string
    base_factor: number
    explorer_transaction: string
    explorer_address: string
    description?: string
    warning?: string
    protocol: string
    min_confirmations: number
  }

  interface Currency {
    id: string
    status: 'enabled' | 'disabled'
    name: string
    icon_url: string
    description?: string
    homepage?: string
    price: string
    type: string
    precision: number
    position: number
    networks: CurrencyNetwork[]
  }

  interface Deposit {
    id: number
    member_id: number
    currency: string
    blockchain_key: string
    amount: number
    address: string
    from_address: string
    txid: string
    status: string
    block_number: number
    tid: string
    created_at: string
    updated_at: string
  }

  interface DepthRow {
    change: boolean
    change_queue?: number
    removing?: boolean
    remove_queue?: number
    price: number
    amount: number
  }

  interface Device {
    session_id: string
    user_ip: string
    user_agent: string
    current_session: boolean
    authenticated_at: string
  }

  interface Market {
    id: string
    symbol: string
    name: string
    type: string // spot | margin
    base_unit: string
    quote_unit: string
    min_price: string
    max_price: string
    min_amount: string
    amount_precision: number
    price_precision: number
    total_precision: number
    state: 'enabled' | 'disabled'
    base_currency: Currency
    quote_currency: Currency
  }

  interface Order {
    id: number
    side: OrderSide
    state: OrderState
    type: OrderType
    price: string
    avg_price: string
    market: string
    origin_volume: string
    remaining_volume: string
    executed_volume: string
    trades_count: number
    created_at: string
    updated_at: string
  }

  interface PublicTrade {
    id: number
    market: string
    price: string
    amount: string
    total: string
    side: OrderSide
    created_at: string
  }

  interface Ticker {
    id: string
    avg_price: string
    high: string
    last: string
    low: string
    open: string
    price_change_percent: string
    volume: string
    amount: string
    market: Market
  }

  interface Trade extends PublicTrade {
    fee_currency: string
    fee: string
    fee_amount: string
    side: OrderSide
    order_id: number
    updated_at: string
  }

  interface WithdrawLimit {
    id: number
    group: string
    kyc_level: string
    limit: string
    created_at: string
    updated_at: string
  }

  interface Withdraw {
    id: number
    member_id: number
    beneficiary_id: number
    currency_id: string
    blockchain_key: string
    amount: number
    fee: number
    txid: string
    status: WithdrawStatus
    block_number: number
    sum: number
    tid: string
    rid: string
    created_at: string
    updated_at: string
  }

  interface InviteLink {
    id: number
    member_id: number
    default: boolean
    invite_code: string
    commission_rebate: number
    cash_rebate: number
    total_invited: number
    note: string
    created_at: string
    updated_at: string
  }

  interface InviteList {
    email: string
    uid: string
    member_id: string
    total: number
    created_at: sring
  }

  interface Commission {
    id: number
    email: string
    uid: string
    friend_id: number
    rate: number
    amount: number
    total: number
    type: CommissionType
    created_at: string
    updated_at: string
  }

  interface InviteOverview {
    total: number
    total_invited: number
    total_traded: number
    total_commission_rebate: number
    total_cash_rebate: number
    total_invitee_rebate: number
  }

  interface InviteOverview {
    total: number
    total_invited: number
    total_traded: number
    total_commission_rebate: number
    total_cash_rebate: number
    total_invitee_rebate: number
  }

  interface AssetStatistic {
    day: string
    total: number
  }

  interface PNLComulative {
    day: string
    change: number
    pnl: number
  }

  interface PNLDaily {
    day: string
    value: number
  }

  interface PNLDistribution {
    pnl_month: number
    pnl_yesterday: number
    trend_month: number
    trend_yesterday: number
  }

  interface Blockchain {
    id: number
    key: string
    name: string
    client: BlockchainClient
    height: number
    protocol: string
    server?: string
    explorer_address?: string
    explorer_transaction?: string
    min_confirmations: number
    status: BlockchainStatus
    warning: string
    created_at: string
    updated_at: string
  }
}

export {}

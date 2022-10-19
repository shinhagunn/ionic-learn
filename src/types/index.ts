import type { Ref } from 'vue'

export enum SortBy {
  Number = 'Number',
  String = 'String',
  Date = 'Date',
}

export enum ActivityResult {
  Succeed = 'succeed',
  Failed = 'failed',
  Denied = 'denied',
}

export enum APIKeyState {
  Active = 'active',
  Disabled = 'disabled',
}

export enum CommissionType {
  Commission = 'commission',
  Cash = 'cash',
}

export enum ActivityTopic {
  All = 'all',
  Account = 'account',
  Password = 'password',
  Session = 'session',
  OTP = 'otp',
}

export enum WithdrawStatus {
  Prepared = 'prepared',
  Canceled = 'canceled',
  Accepted = 'accepted',
  Skipped = 'skipped',
  ToReject = 'to_reject',
  Rejected = 'rejected',
  Processing = 'processing',
  UnderReview = 'under_review',
  Succeed = 'succeed',
  Failed = 'failed',
  Errored = 'errored',
  Confirming = 'confirming',
}

export enum CurrencyNetworkStatus {
  Active = 'active',
  Disabled = 'disabled',
}

export enum InputType {
  Text = 'text',
  Number = 'number',
  Decimal = 'decimal',
  Password = 'password',
}

export enum Placement {
  BottomLeft = 'bottomLeft',
  BottomCenter = 'bottomCenter',
  BottomRight = 'bottomRight',
  TopLeft = 'topLeft',
  TopCenter = 'topCenter',
  TopRight = 'topRight',
}

export enum TooltipPlacement {
  Bottom = 'bottom',
  Top = 'top',
  Left = 'left',
  Right = 'right',
}

export enum UserState {
  Loading = 'loading',
  Active = 'active',
  Deleted = 'deleted',
  Pending = 'pending',
}

export interface UserPhone {
  id: number
  number: string
  region: string
  created_at: string
  updated_at: string
}

export enum UserLabelScope {
  Public = 'public',
  Private = 'private',
}

export interface UserLabel {
  id: number
  key: string
  value: string
  scope: UserLabelScope
  description?: string
  created_at: string
  updated_at: string
}

export const enum ExchangeLayout {
  Basic = 'basic',
  Pro = 'pro',
}

export enum OrderSide {
  Buy = 'buy',
  Sell = 'sell',
}

export enum OrderType {
  Limit = 'limit',
  Market = 'market',
}

export enum OrderState {
  Pending = 'pending',
  Wait = 'wait',
  Done = 'done',
  Canceled = 'cancel',
  Rejected = 'rejected',
}

export enum Align {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export enum Format {
  DateTime = 'datetime',
  DateTimeNoYear = 'datetime-no-year',
  Time = 'time',
  Price = 'price',
  Amount = 'amount',
  Total = 'total',
  Change = 'change',
  TickerVolume = 'ticker_volume',
}

export enum ParseType {
  DateTime = 'datetime',
  Time = 'time',
  Decimal = 'decimal',
}

export interface ZTableColumn {
  key: string
  title?: string
  class?: string
  align?: Align
  sort?: boolean
  sortBy?: SortBy
  scopedSlots?: boolean
  headScopedSlots?: boolean
  formatBy?: Format
  sideKey?: string
  toUpper?: boolean
  toLower?: boolean
  hideColumn?: boolean
  parse?: ParseType
  sortKeyword?: boolean
  precision?: number | ((item: any) => number)
  prefix?: string | ((item: any) => string)
  suffix?: string | ((item: any) => string)
}

export interface ZTabItem {
  key: string
  text?: string
  slotName?: boolean
}

export enum NoticeType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warn = 'warn',
}

export interface NoticeOptions {
  placement?: Placement
  duration?: number
}

export interface MessageOptions extends NoticeOptions {
  message: string
}

export interface NotificationOptions extends NoticeOptions {
  title?: string
  description?: string
}

export enum WebSocketType {
  Public = 'public',
  Private = 'private',
}

export const enum ChartType {
  Bars = 'bars',
  Candles = 'candles',
  Line = 'line',
  Area = 'area',
  HeikenAshi = 'heiken_ashi',
  HollowCandles = 'hollow_candles',
  Baseline = 'baseline',
  Renko = 'renko',
  Kagi = 'kagi',
  PointAndFigure = 'point_and_figure',
  LineBreak = 'line_break',
}

export enum AssetType {
  Spot = 'spot',
  Futures = 'futures', // NOT READY
  P2P = 'p2p', // NOT READY
  Convert = 'convert', // NOT READY
  Margin = 'margin', // NOT READY
}

export interface DepositAddress {
  currencies: string[]
  network: string
  address: string
}

export interface Asset {
  currency: string
  balance: string
  locked: string
  deposit_addresses: DepositAddress[]
}

export interface DisabledRule {
  key: string
  required?: boolean
}

export interface Country {
  name: string
  code: string
  timezone: string
  utc: string
  mobile_code: string
}

export enum BlockchainClient {
  Bitcoin = 'bitcoin',
  Ethereum = 'evm',
  Tron = 'tron',
}

export enum BlockchainStatus {
  Active = 'active',
  Disabled = 'disabled',
  Idle = 'idle',
}

export enum OrdersManagerType {
  OpenOrders = 'open_orders',
  OrdersHistory = 'orders_history',
}

export type ZSelectList = {
  text: string
  key: string
}[]

export type ZValidate = (v: any) => (string | undefined)

export interface ZAuthFormField {
  key: string
  hidden?: boolean
  name: string
  label: string
  placeholder: string
  type?: InputType
  maxLength?: number
  required?: boolean
  validate?: ZValidate[]
  transformErrors?: Record<string, string>
  styles?: string
  class?: string
  value?: Ref<any>
}

export type TradingViewResolution = '1' | '5' | '15' | '30' | '60' | '1D' | '1W' | '1440' | '10080'

export interface TradingViewLastBar {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  isLastBar?: boolean
  isBarClosed?: boolean
}

export interface TradingViewStream {
  key: string
  market: Market
  channelString: string
  lastBar: TradingViewLastBar
  listener: (lastBar: TradingViewLastBar) => void
  resolution: TradingViewResolution
  subscribeUID: string
  symbolInfo: TradingView.LibrarySymbolInfo
}

export type StorageLike = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>

export interface PersistedStateOptions {
  /**
   * Storage key to use.
   * @default $store.id
   */
  key?: string

  /**
   * Where to store persisted state.
   * @default localStorage
   */
  storage?: StorageLike

  /**
   * Dot-notation paths to partially save state.
   * @default undefined
   */
  paths?: Array<string>

  /**
   * Overwrite initial state (patch otherwise).
   * @default false
   */
  overwrite?: boolean
}

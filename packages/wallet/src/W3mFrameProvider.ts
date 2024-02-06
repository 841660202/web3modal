import { W3mFrame } from './W3mFrame.js'
import type { W3mFrameTypes } from './W3mFrameTypes.js'
import { W3mFrameConstants, W3mFrameRpcConstants } from './W3mFrameConstants.js'
import { W3mFrameStorage } from './W3mFrameStorage.js'
import { W3mFrameHelpers } from './W3mFrameHelpers.js'

// -- Types -----------------------------------------------------------
type Resolver<T> = { resolve: (value: T) => void; reject: (reason?: unknown) => void } | undefined
type ConnectEmailResolver = Resolver<W3mFrameTypes.Responses['FrameConnectEmailResponse']>
type ConnectDeviceResolver = Resolver<undefined>
type ConnectOtpResolver = Resolver<undefined>
type ConnectResolver = Resolver<W3mFrameTypes.Responses['FrameGetUserResponse']>
type DisconnectResolver = Resolver<undefined>
type IsConnectedResolver = Resolver<W3mFrameTypes.Responses['FrameIsConnectedResponse']>
type GetChainIdResolver = Resolver<W3mFrameTypes.Responses['FrameGetChainIdResponse']>
type SwitchChainResolver = Resolver<W3mFrameTypes.Responses['FrameSwitchNetworkResponse']>
type RpcRequestResolver = Resolver<W3mFrameTypes.RPCResponse>
type UpdateEmailResolver = Resolver<undefined>
type AwaitUpdateEmailResolver = Resolver<W3mFrameTypes.Responses['FrameAwaitUpdateEmailResponse']>
type SyncThemeResolver = Resolver<undefined>
type SyncDappDataResolver = Resolver<undefined>

/*
 * -- Provider --------------------------------------------------------
 * W3mFrameProvider 的 JavaScript 类，它封装了与 W3mFrame 类交互的逻辑，并提供了一系列方法来处理与区块链相关的操作。
 * 这个类充当了一个中间层，允许开发者通过一系列的方法调用来与 iframe 内的内容进行交云。
 * 以下是对类的主要部分的详细解释：
 *
 * 1. 构造函数 W3mFrameProvider(projectId: string)：创建一个新的 W3mFrameProvider 实例。
 * 2. connectEmail(payload: W3mFrameTypes.Requests['AppConnectEmailRequest'])：发起一个邮箱连接请求。
 * 3. connectDevice()：发起一个设备连接请求。
 * 4. connectOtp(payload: W3mFrameTypes.Requests['AppConnectOtpRequest'])：发起一个OTP连接请求。
 * 5. isConnected()：检查当前是否已连接。
 * 6. getChainId()：获取当前的链ID。
 * 7. updateEmail(payload: W3mFrameTypes.Requests['AppUpdateEmailRequest'])：发起更新邮箱的请求。
 * 8. awaitUpdateEmail()：等待邮箱更新的请求。
 * 9. syncTheme(payload: W3mFrameTypes.Requests['AppSyncThemeRequest'])：同步应用的主题。
 * 10. syncDappData(payload: W3mFrameTypes.Requests['AppSyncDappDataRequest'])：同步DApp数据。
 * 11. connect(payload?: W3mFrameTypes.Requests['AppGetUserRequest'])：发起一个连接请求。
 * 12. switchNetwork(chainId: number)：发起一个网络切换请求。
 * 13. disconnect()：发起一个断开连接请求。
 * 14. request(req: W3mFrameTypes.RPCRequest)：发起一个RPC请求。
 * 15. onRpcRequest(callback: (request: unknown) => void)：监听来自 iframe 的 RPC 请求。
 * 16. onRpcResponse(callback: (request: unknown) => void)：监听来自 iframe 的 RPC 响应。
 * 17. onIsConnected(callback: () => void)：监听来自 iframe 的连接成功事件。
 *  18. getLoginEmailUsed()：表示是否使用了邮箱登录。
 * 19. getEmail()：返回存储的邮箱地址。
 *  20. getLoginEmailUsed()：表示是否使用了邮箱登录。
 * 21. getEmail()：返回存储的邮箱地址。
 * 22. connectEmail(payload: W3mFrameTypes.Requests['AppConnectEmailRequest'])：发起一个邮箱连接请求。
 * 23. connectDevice()：发起一个设备连接请求。
 * 24. connectOtp(payload: W3mFrameTypes.Requests['AppConnectOtpRequest'])：发起一个OTP连接请求。
 * 25. isConnected()：检查当前是否已连接。
 * 26. getChainId()：获取当前的链ID。
 */

export class W3mFrameProvider {
  private w3mFrame: W3mFrame

  private connectEmailResolver: ConnectEmailResolver = undefined

  private connectDeviceResolver: ConnectDeviceResolver = undefined

  private connectOtpResolver: ConnectOtpResolver | undefined = undefined

  private connectResolver: ConnectResolver = undefined

  private disconnectResolver: DisconnectResolver = undefined

  private isConnectedResolver: IsConnectedResolver = undefined

  private getChainIdResolver: GetChainIdResolver = undefined

  private switchChainResolver: SwitchChainResolver = undefined

  private rpcRequestResolver: RpcRequestResolver = undefined

  private updateEmailResolver: UpdateEmailResolver = undefined

  private awaitUpdateEmailResolver: AwaitUpdateEmailResolver = undefined

  private syncThemeResolver: SyncThemeResolver = undefined

  private syncDappDataResolver: SyncDappDataResolver = undefined

  public constructor(projectId: string) {
    this.w3mFrame = new W3mFrame(projectId, true)
    // 监听来自 iframe 的事件
    this.w3mFrame.events.onFrameEvent(event => {
      // eslint-disable-next-line no-console
      console.log('💻 received', event)

      switch (event.type) {
        case W3mFrameConstants.FRAME_CONNECT_EMAIL_SUCCESS:
          return this.onConnectEmailSuccess(event)
        case W3mFrameConstants.FRAME_CONNECT_EMAIL_ERROR:
          return this.onConnectEmailError(event)
        case W3mFrameConstants.FRAME_CONNECT_DEVICE_SUCCESS:
          return this.onConnectDeviceSuccess()
        case W3mFrameConstants.FRAME_CONNECT_DEVICE_ERROR:
          return this.onConnectDeviceError(event)
        case W3mFrameConstants.FRAME_CONNECT_OTP_SUCCESS:
          return this.onConnectOtpSuccess()
        case W3mFrameConstants.FRAME_CONNECT_OTP_ERROR:
          return this.onConnectOtpError(event)
        case W3mFrameConstants.FRAME_GET_USER_SUCCESS:
          return this.onConnectSuccess(event)
        case W3mFrameConstants.FRAME_GET_USER_ERROR:
          return this.onConnectError(event)
        case W3mFrameConstants.FRAME_IS_CONNECTED_SUCCESS:
          return this.onIsConnectedSuccess(event)
        case W3mFrameConstants.FRAME_IS_CONNECTED_ERROR:
          return this.onIsConnectedError(event)
        case W3mFrameConstants.FRAME_GET_CHAIN_ID_SUCCESS:
          return this.onGetChainIdSuccess(event)
        case W3mFrameConstants.FRAME_GET_CHAIN_ID_ERROR:
          return this.onGetChainIdError(event)
        case W3mFrameConstants.FRAME_SIGN_OUT_SUCCESS:
          return this.onSignOutSuccess()
        case W3mFrameConstants.FRAME_SIGN_OUT_ERROR:
          return this.onSignOutError(event)
        case W3mFrameConstants.FRAME_SWITCH_NETWORK_SUCCESS:
          return this.onSwitchChainSuccess(event)
        case W3mFrameConstants.FRAME_SWITCH_NETWORK_ERROR:
          return this.onSwitchChainError(event)
        case W3mFrameConstants.FRAME_RPC_REQUEST_SUCCESS:
          return this.onRpcRequestSuccess(event)
        case W3mFrameConstants.FRAME_RPC_REQUEST_ERROR:
          return this.onRpcRequestError(event)
        case W3mFrameConstants.FRAME_SESSION_UPDATE:
          return this.onSessionUpdate(event)
        case W3mFrameConstants.FRAME_UPDATE_EMAIL_SUCCESS:
          return this.onUpdateEmailSuccess()
        case W3mFrameConstants.FRAME_UPDATE_EMAIL_ERROR:
          return this.onUpdateEmailError(event)
        case W3mFrameConstants.FRAME_AWAIT_UPDATE_EMAIL_SUCCESS:
          return this.onAwaitUpdateEmailSuccess(event)
        case W3mFrameConstants.FRAME_AWAIT_UPDATE_EMAIL_ERROR:
          return this.onAwaitUpdateEmailError(event)
        case W3mFrameConstants.FRAME_SYNC_THEME_SUCCESS:
          return this.onSyncThemeSuccess()
        case W3mFrameConstants.FRAME_SYNC_THEME_ERROR:
          return this.onSyncThemeError(event)
        case W3mFrameConstants.FRAME_SYNC_DAPP_DATA_SUCCESS:
          return this.onSyncDappDataSuccess()
        case W3mFrameConstants.FRAME_SYNC_DAPP_DATA_ERROR:
          return this.onSyncDappDataError(event)
        default:
          return null
      }
    })
  }

  /*
   * -- Extended Methods ------------------------------------------------
   * 表示是否使用了邮箱登录
   */
  public getLoginEmailUsed() {
    return Boolean(W3mFrameStorage.get(W3mFrameConstants.EMAIL_LOGIN_USED_KEY))
  }
  // 返回存储的邮箱地址
  public getEmail() {
    return W3mFrameStorage.get(W3mFrameConstants.EMAIL)
  }
  // 发起一个邮箱连接请求
  public async connectEmail(payload: W3mFrameTypes.Requests['AppConnectEmailRequest']) {
    await this.w3mFrame.frameLoadPromise
    W3mFrameHelpers.checkIfAllowedToTriggerEmail()
    this.w3mFrame.events.postAppEvent({ type: W3mFrameConstants.APP_CONNECT_EMAIL, payload })

    return new Promise<W3mFrameTypes.Responses['FrameConnectEmailResponse']>((resolve, reject) => {
      this.connectEmailResolver = { resolve, reject }
    })
  }
  // 发起一个设备连接请求
  public async connectDevice() {
    await this.w3mFrame.frameLoadPromise
    this.w3mFrame.events.postAppEvent({ type: W3mFrameConstants.APP_CONNECT_DEVICE })

    return new Promise((resolve, reject) => {
      this.connectDeviceResolver = { resolve, reject }
    })
  }
  // 发起一个OTP连接请求
  public async connectOtp(payload: W3mFrameTypes.Requests['AppConnectOtpRequest']) {
    await this.w3mFrame.frameLoadPromise
    this.w3mFrame.events.postAppEvent({ type: W3mFrameConstants.APP_CONNECT_OTP, payload })

    return new Promise((resolve, reject) => {
      this.connectOtpResolver = { resolve, reject }
    })
  }
  // 检查当前是否已连接
  public async isConnected() {
    await this.w3mFrame.frameLoadPromise
    this.w3mFrame.events.postAppEvent({
      type: W3mFrameConstants.APP_IS_CONNECTED,
      payload: undefined
    })

    return new Promise<W3mFrameTypes.Responses['FrameIsConnectedResponse']>((resolve, reject) => {
      this.isConnectedResolver = { resolve, reject }
    })
  }
  // 获取当前的链ID
  public async getChainId() {
    await this.w3mFrame.frameLoadPromise
    this.w3mFrame.events.postAppEvent({ type: W3mFrameConstants.APP_GET_CHAIN_ID })

    return new Promise<W3mFrameTypes.Responses['FrameGetChainIdResponse']>((resolve, reject) => {
      this.getChainIdResolver = { resolve, reject }
    })
  }
  // 发起更新邮箱的请求
  public async updateEmail(payload: W3mFrameTypes.Requests['AppUpdateEmailRequest']) {
    await this.w3mFrame.frameLoadPromise
    W3mFrameHelpers.checkIfAllowedToTriggerEmail()
    this.w3mFrame.events.postAppEvent({ type: W3mFrameConstants.APP_UPDATE_EMAIL, payload })

    return new Promise((resolve, reject) => {
      this.updateEmailResolver = { resolve, reject }
    })
  }
  // 等待邮箱更新的请求
  public async awaitUpdateEmail() {
    await this.w3mFrame.frameLoadPromise
    this.w3mFrame.events.postAppEvent({ type: W3mFrameConstants.APP_AWAIT_UPDATE_EMAIL })

    return new Promise<W3mFrameTypes.Responses['FrameAwaitUpdateEmailResponse']>(
      (resolve, reject) => {
        this.awaitUpdateEmailResolver = { resolve, reject }
      }
    )
  }
  // 同步应用的主题
  public async syncTheme(payload: W3mFrameTypes.Requests['AppSyncThemeRequest']) {
    await this.w3mFrame.frameLoadPromise
    this.w3mFrame.events.postAppEvent({ type: W3mFrameConstants.APP_SYNC_THEME, payload })

    return new Promise((resolve, reject) => {
      this.syncThemeResolver = { resolve, reject }
    })
  }
  // 同步DApp数据。
  public async syncDappData(payload: W3mFrameTypes.Requests['AppSyncDappDataRequest']) {
    await this.w3mFrame.frameLoadPromise
    this.w3mFrame.events.postAppEvent({ type: W3mFrameConstants.APP_SYNC_DAPP_DATA, payload })

    return new Promise((resolve, reject) => {
      this.syncDappDataResolver = { resolve, reject }
    })
  }

  // -- Provider Methods ------------------------------------------------
  public async connect(payload?: W3mFrameTypes.Requests['AppGetUserRequest']) {
    const chainId = payload?.chainId ?? this.getLastUsedChainId() ?? 1
    await this.w3mFrame.frameLoadPromise
    this.w3mFrame.events.postAppEvent({
      type: W3mFrameConstants.APP_GET_USER,
      payload: { chainId }
    })

    return new Promise<W3mFrameTypes.Responses['FrameGetUserResponse']>((resolve, reject) => {
      this.connectResolver = { resolve, reject }
    })
  }

  public async switchNetwork(chainId: number) {
    await this.w3mFrame.frameLoadPromise
    this.w3mFrame.events.postAppEvent({
      type: W3mFrameConstants.APP_SWITCH_NETWORK,
      payload: { chainId }
    })

    return new Promise<W3mFrameTypes.Responses['FrameSwitchNetworkResponse']>((resolve, reject) => {
      this.switchChainResolver = { resolve, reject }
    })
  }

  public async disconnect() {
    await this.w3mFrame.frameLoadPromise
    this.w3mFrame.events.postAppEvent({ type: W3mFrameConstants.APP_SIGN_OUT })

    return new Promise((resolve, reject) => {
      this.disconnectResolver = { resolve, reject }
    })
  }

  public async request(req: W3mFrameTypes.RPCRequest) {
    await this.w3mFrame.frameLoadPromise

    if (W3mFrameRpcConstants.GET_CHAIN_ID === req.method) {
      return this.getLastUsedChainId()
    }

    this.w3mFrame.events.postAppEvent({
      type: W3mFrameConstants.APP_RPC_REQUEST,
      payload: req
    })

    return new Promise<W3mFrameTypes.RPCResponse>((resolve, reject) => {
      this.rpcRequestResolver = { resolve, reject }
    })
  }

  public onRpcRequest(callback: (request: unknown) => void) {
    this.w3mFrame.events.onAppEvent(event => {
      if (event.type.includes(W3mFrameConstants.RPC_METHOD_KEY)) {
        callback(event)
      }
    })
  }

  public onRpcResponse(callback: (request: unknown) => void) {
    this.w3mFrame.events.onFrameEvent(event => {
      if (event.type.includes(W3mFrameConstants.RPC_METHOD_KEY)) {
        callback(event)
      }
    })
  }

  public onIsConnected(callback: () => void) {
    this.w3mFrame.events.onFrameEvent(event => {
      if (event.type === W3mFrameConstants.FRAME_GET_USER_SUCCESS) {
        callback()
      }
    })
  }

  // -- Promise Handlers ------------------------------------------------
  private onConnectEmailSuccess(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/CONNECT_EMAIL_SUCCESS' }>
  ) {
    this.connectEmailResolver?.resolve(event.payload)
    this.setNewLastEmailLoginTime()
  }

  private onConnectEmailError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/CONNECT_EMAIL_ERROR' }>
  ) {
    this.connectEmailResolver?.reject(event.payload.message)
  }

  private onConnectDeviceSuccess() {
    this.connectDeviceResolver?.resolve(undefined)
  }

  private onConnectDeviceError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/CONNECT_DEVICE_ERROR' }>
  ) {
    this.connectDeviceResolver?.reject(event.payload.message)
  }

  private onConnectOtpSuccess() {
    this.connectOtpResolver?.resolve(undefined)
  }

  private onConnectOtpError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/CONNECT_OTP_ERROR' }>
  ) {
    this.connectOtpResolver?.reject(event.payload.message)
  }

  private onConnectSuccess(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/GET_USER_SUCCESS' }>
  ) {
    this.setEmailLoginSuccess(event.payload.email)
    this.setLastUsedChainId(event.payload.chainId)
    this.connectResolver?.resolve(event.payload)
  }

  private onConnectError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/GET_USER_ERROR' }>
  ) {
    this.connectResolver?.reject(event.payload.message)
  }

  private onIsConnectedSuccess(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/IS_CONNECTED_SUCCESS' }>
  ) {
    if (!event.payload.isConnected) {
      this.deleteEmailLoginCache()
    }
    this.isConnectedResolver?.resolve(event.payload)
  }

  private onIsConnectedError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/IS_CONNECTED_ERROR' }>
  ) {
    this.isConnectedResolver?.reject(event.payload.message)
  }

  private onGetChainIdSuccess(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/GET_CHAIN_ID_SUCCESS' }>
  ) {
    this.setLastUsedChainId(event.payload.chainId)
    this.getChainIdResolver?.resolve(event.payload)
  }

  private onGetChainIdError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/GET_CHAIN_ID_ERROR' }>
  ) {
    this.getChainIdResolver?.reject(event.payload.message)
  }

  private onSignOutSuccess() {
    this.disconnectResolver?.resolve(undefined)
    this.deleteEmailLoginCache()
  }

  private onSignOutError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/SIGN_OUT_ERROR' }>
  ) {
    this.disconnectResolver?.reject(event.payload.message)
  }

  private onSwitchChainSuccess(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/SWITCH_NETWORK_SUCCESS' }>
  ) {
    this.setLastUsedChainId(event.payload.chainId)
    this.switchChainResolver?.resolve(event.payload)
  }

  private onSwitchChainError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/SWITCH_NETWORK_ERROR' }>
  ) {
    this.switchChainResolver?.reject(event.payload.message)
  }

  private onRpcRequestSuccess(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/RPC_REQUEST_SUCCESS' }>
  ) {
    this.rpcRequestResolver?.resolve(event.payload)
  }

  private onRpcRequestError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/RPC_REQUEST_ERROR' }>
  ) {
    this.rpcRequestResolver?.reject(event.payload.message)
  }

  private onSessionUpdate(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/SESSION_UPDATE' }>
  ) {
    const { payload } = event
    if (payload) {
      // Ilja TODO: this.setSessionToken(payload.token)
    }
  }

  private onUpdateEmailSuccess() {
    this.updateEmailResolver?.resolve(undefined)
    this.setNewLastEmailLoginTime()
  }

  private onUpdateEmailError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/UPDATE_EMAIL_ERROR' }>
  ) {
    this.updateEmailResolver?.reject(event.payload.message)
  }

  private onAwaitUpdateEmailSuccess(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/AWAIT_UPDATE_EMAIL_SUCCESS' }>
  ) {
    this.setEmailLoginSuccess(event.payload.email)
    this.awaitUpdateEmailResolver?.resolve(event.payload)
  }

  private onAwaitUpdateEmailError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/AWAIT_UPDATE_EMAIL_ERROR' }>
  ) {
    this.awaitUpdateEmailResolver?.reject(event.payload.message)
  }

  private onSyncThemeSuccess() {
    this.syncThemeResolver?.resolve(undefined)
  }

  private onSyncThemeError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/SYNC_THEME_ERROR' }>
  ) {
    this.syncThemeResolver?.reject(event.payload.message)
  }

  private onSyncDappDataSuccess() {
    this.syncDappDataResolver?.resolve(undefined)
  }

  private onSyncDappDataError(
    event: Extract<W3mFrameTypes.FrameEvent, { type: '@w3m-frame/SYNC_DAPP_DATA_ERROR' }>
  ) {
    this.syncDappDataResolver?.reject(event.payload.message)
  }

  // -- Private Methods -------------------------------------------------
  private setNewLastEmailLoginTime() {
    W3mFrameStorage.set(W3mFrameConstants.LAST_EMAIL_LOGIN_TIME, Date.now().toString())
  }

  private setEmailLoginSuccess(email: string) {
    W3mFrameStorage.set(W3mFrameConstants.EMAIL, email)
    W3mFrameStorage.set(W3mFrameConstants.EMAIL_LOGIN_USED_KEY, 'true')
    W3mFrameStorage.delete(W3mFrameConstants.LAST_EMAIL_LOGIN_TIME)
  }

  private deleteEmailLoginCache() {
    W3mFrameStorage.delete(W3mFrameConstants.EMAIL_LOGIN_USED_KEY)
    W3mFrameStorage.delete(W3mFrameConstants.EMAIL)
    W3mFrameStorage.delete(W3mFrameConstants.LAST_USED_CHAIN_KEY)
  }

  private setLastUsedChainId(chainId: number) {
    W3mFrameStorage.set(W3mFrameConstants.LAST_USED_CHAIN_KEY, `${chainId}`)
  }

  private getLastUsedChainId() {
    return Number(W3mFrameStorage.get(W3mFrameConstants.LAST_USED_CHAIN_KEY))
  }
}

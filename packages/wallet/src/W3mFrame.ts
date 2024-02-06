import { W3mFrameConstants } from './W3mFrameConstants.js'
import { W3mFrameSchema } from './W3mFrameSchema.js'
import { W3mFrameHelpers } from './W3mFrameHelpers.js'
import type { W3mFrameTypes } from './W3mFrameTypes.js'

/*
 * -- Sdk --------------------------------------------------------------------
 * 这段代码定义了一个名为 W3mFrame 的JavaScript类，它是用于创建和管理一个内嵌的iframe，该iframe用于与区块链网络进行交互。以下是对类的主要部分的详细解释：
 */
export class W3mFrame {
  private iframe: HTMLIFrameElement | null = null

  private projectId: string

  private rpcUrl = W3mFrameHelpers.getBlockchainApiUrl()
  // 一个Promise对象，用于管理iframe加载完成时的异步操作。
  public frameLoadPromise: Promise<void>
  // 一个对象，包含 resolve 和 reject 函数，用于处理 frameLoadPromise 的解决和拒绝。
  public frameLoadPromiseResolver:
    | {
        resolve: (value: undefined) => void
        reject: (reason?: unknown) => void
      }
    | undefined
  // 一个构造函数，用于创建一个新的 W3mFrame 实例。
  public constructor(projectId: string, isAppClient = false) {
    this.projectId = projectId
    this.frameLoadPromise = new Promise((resolve, reject) => {
      this.frameLoadPromiseResolver = { resolve, reject }
    })

    /*
     * Create iframe only when sdk is initialised from dapp / web3modal
     * 创建 iframe 仅当 sdk 从 dapp / web3modal 初始化时。
     */
    if (isAppClient) {
      this.frameLoadPromise = new Promise((resolve, reject) => {
        this.frameLoadPromiseResolver = { resolve, reject }
      })
      const iframe = document.createElement('iframe')
      iframe.id = 'w3m-iframe'
      iframe.src = `${W3mFrameConstants.SECURE_SITE_SDK}?projectId=${projectId}`
      iframe.style.position = 'fixed'
      iframe.style.zIndex = '999999'
      iframe.style.display = 'none'
      iframe.style.opacity = '0'
      iframe.style.borderRadius = `clamp(0px, var(--wui-border-radius-l), 44px)`
      document.body.appendChild(iframe)
      this.iframe = iframe
      this.iframe.onload = () => {
        this.frameLoadPromiseResolver?.resolve(undefined)
      }
      this.iframe.onerror = () => {
        this.frameLoadPromiseResolver?.reject('Unable to load email login dependency')
      }
    }
  }

  // -- Networks --------------------------------------------------------------
  get networks(): Record<number, W3mFrameTypes.Network> {
    const data = [
      1, 5, 11155111, 10, 420, 42161, 421613, 137, 80001, 42220, 1313161554, 1313161555, 56, 97,
      43114, 43113, 324, 280, 100, 8453, 84531, 7777777, 999
    ].map(id => ({
      [id]: {
        rpcUrl: `${this.rpcUrl}/v1/?chainId=eip155:${id}&projectId=${this.projectId}`,
        chainId: id
      }
    }))

    return Object.assign({}, ...data)
  }

  // -- Events ----------------------------------------------------------------
  public events = {
    //  一个方法，用于监听来自iframe的消息事件，当接收到与 FRAME_EVENT_KEY 相关的消息时，解析事件并执行回调
    onFrameEvent: (callback: (event: W3mFrameTypes.FrameEvent) => void) => {
      window.addEventListener('message', ({ data }) => {
        if (!data.type?.includes(W3mFrameConstants.FRAME_EVENT_KEY)) {
          return
        }
        const frameEvent = W3mFrameSchema.frameEvent.parse(data)
        callback(frameEvent)
      })
    },
    // 类似于 onFrameEvent，但用于处理应用程序事件
    onAppEvent: (callback: (event: W3mFrameTypes.AppEvent) => void) => {
      window.addEventListener('message', ({ data }) => {
        if (!data.type?.includes(W3mFrameConstants.APP_EVENT_KEY)) {
          return
        }
        const appEvent = W3mFrameSchema.appEvent.parse(data)
        callback(appEvent)
      })
    },
    // 用于向iframe发送消息，先验证事件结构，然后使用 postMessage 函数发送。
    postAppEvent: (event: W3mFrameTypes.AppEvent) => {
      if (!this.iframe?.contentWindow) {
        throw new Error('W3mFrame: iframe is not set')
      }
      W3mFrameSchema.appEvent.parse(event)
      window.postMessage(event)
      this.iframe.contentWindow.postMessage(event, '*')
    },
    // 用于向父窗口发送消息，同样先进行事件结构验证。
    postFrameEvent: (event: W3mFrameTypes.FrameEvent) => {
      if (!parent) {
        throw new Error('W3mFrame: parent is not set')
      }
      W3mFrameSchema.frameEvent.parse(event)
      parent.postMessage(event, '*')
    }
  }
}

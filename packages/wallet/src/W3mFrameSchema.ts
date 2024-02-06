/*
 * 为什么用zod?
 * 1. 用于验证数据的模式
 * 2. 用于自动生成 TypeScript 类型
 * 3. 用于运行时数据验证
 * 4. 用于类型守卫
 * 5. 用于错误处理
 * 6. 用于组合和扩展
 * 7. 用于自定义验证
 * 8. 用于解析和转换
 * 9. 用于增强代码的可读性和可维护性
 * 10. 用于提高应用程序的健壮性
 * 11. 用于减少由于意外的无效数据导致的运行时错误
 * http://t-blog-images.aijs.top/img/202402041451674.webp
 */
import { z } from 'zod'
import { W3mFrameConstants } from './W3mFrameConstants.js'

// -- Helpers ----------------------------------------------------------------
const zError = z.object({ message: z.string() })

function zType<K extends keyof typeof W3mFrameConstants>(key: K) {
  return z.literal(W3mFrameConstants[key])
}
/*
 * http://t-blog-images.aijs.top/img/202402041438794.webp
 * -- Responses --------------------------------------------------------------
 */
// 定义了获取交易的响应对象的模式
export const GetTransactionByHashResponse = z.object({
  accessList: z.array(z.string()),
  blockHash: z.string().nullable(),
  blockNumber: z.string().nullable(),
  chainId: z.string(),
  from: z.string(),
  gas: z.string(),
  hash: z.string(),
  input: z.string().nullable(),
  maxFeePerGas: z.string(),
  maxPriorityFeePerGas: z.string(),
  nonce: z.string(),
  r: z.string(),
  s: z.string(),
  to: z.string(),
  transactionIndex: z.string().nullable(),
  type: z.string(),
  v: z.string(),
  value: z.string()
})
// 定义了应用程序切换网络请求的模式
export const AppSwitchNetworkRequest = z.object({ chainId: z.number() })
// 定义了应用程序连接电子邮件请求的模式
export const AppConnectEmailRequest = z.object({ email: z.string().email() })
// 定义了应用程序连接OTP请求的模式
export const AppConnectOtpRequest = z.object({ otp: z.string() })
// 定义了应用程序获取用户请求的模式
export const AppGetUserRequest = z.object({ chainId: z.optional(z.number()) })
// 定义了应用程序更新电子邮件请求的模式
export const AppUpdateEmailRequest = z.object({ email: z.string().email() })
// 定义了应用程序同步主题请求的模式
export const AppSyncThemeRequest = z.object({
  themeMode: z.optional(z.enum(['light', 'dark'])),
  themeVariables: z.optional(z.record(z.string(), z.string().or(z.number())))
})
// 定义了应用程序同步Dapp数据请求的模式
export const AppSyncDappDataRequest = z.object({
  metadata: z
    .object({
      name: z.string(),
      description: z.string(),
      url: z.string(),
      icons: z.array(z.string())
    })
    .optional(),
  sdkVersion: z.string() as z.ZodType<
    | `${'html' | 'react' | 'vue'}-wagmi-${string}`
    | `${'html' | 'react' | 'vue'}-ethers5-${string}`
    | `${'html' | 'react' | 'vue'}-ethers-${string}`
  >,
  projectId: z.string()
})
// 定义了应用程序连接OTP响应的模式
export const FrameConnectEmailResponse = z.object({
  action: z.enum(['VERIFY_DEVICE', 'VERIFY_OTP'])
})
// 定义了应用程序获取用户响应的模式
export const FrameGetUserResponse = z.object({
  email: z.string().email(),
  address: z.string(),
  chainId: z.number()
})
// 定义了应用程序连接OTP响应的模式
export const FrameIsConnectedResponse = z.object({ isConnected: z.boolean() })
// 定义了应用程序获取链ID响应的模式
export const FrameGetChainIdResponse = z.object({ chainId: z.number() })
// 定义了应用程序切换网络响应的模式
export const FrameSwitchNetworkResponse = z.object({ chainId: z.number() })
// 定义了应用程序更新电子邮件响应的模式
export const FrameAwaitUpdateEmailResponse = z.object({ email: z.string().email() })
// -- RPC --------------------------------------------------------------------
export const RpcResponse = z.any()
// -- Requests ---------------------------------------------------------------
export const RpcPersonalSignRequest = z.object({
  method: z.literal('personal_sign'),
  params: z.array(z.any())
})
// 定义了RPC以太坊发送交易请求的模式
export const RpcEthSendTransactionRequest = z.object({
  method: z.literal('eth_sendTransaction'),
  params: z.array(z.any())
})
// 定义了RPC以太坊账户请求的模式
export const RpcEthAccountsRequest = z.object({
  method: z.literal('eth_accounts')
})
// 定义了RPC获取余额请求的模式
export const RpcGetBalance = z.object({
  method: z.literal('eth_getBalance'),
  params: z.array(z.any())
})
// 定义了RPC估算燃气请求的模式
export const RpcEthEstimateGas = z.object({
  method: z.literal('eth_estimateGas'),
  params: z.array(z.any())
})
// 定义了RPC以太坊燃气价格请求的模式
export const RpcEthGasPrice = z.object({
  method: z.literal('eth_gasPrice')
})
// 定义了RPC以太坊签名类型数据V4请求的模式
export const RpcEthSignTypedDataV4 = z.object({
  method: z.literal('eth_signTypedData_v4'),
  params: z.array(z.any())
})
// 定义了RPC以太坊获取交易请求的模式
export const RpcEthGetTransactionByHash = z.object({
  method: z.literal('eth_getTransactionByHash'),
  params: z.array(z.any())
})
// 定义了RPC以太坊块编号请求的模式
export const RpcEthBlockNumber = z.object({
  method: z.literal('eth_blockNumber')
})
//  定义了RPC以太坊链ID请求的模式
export const RpcEthChainId = z.object({
  method: z.literal('eth_chainId')
})
//  定义了RPC请求的模式
export const FrameSession = z.object({
  token: z.string()
})

export const W3mFrameSchema = {
  // -- App Events -----------------------------------------------------------

  appEvent: z
    .object({ type: zType('APP_SWITCH_NETWORK'), payload: AppSwitchNetworkRequest })

    .or(z.object({ type: zType('APP_CONNECT_EMAIL'), payload: AppConnectEmailRequest }))

    .or(z.object({ type: zType('APP_CONNECT_DEVICE') }))

    .or(z.object({ type: zType('APP_CONNECT_OTP'), payload: AppConnectOtpRequest }))

    .or(z.object({ type: zType('APP_GET_USER'), payload: z.optional(AppGetUserRequest) }))

    .or(z.object({ type: zType('APP_SIGN_OUT') }))

    .or(z.object({ type: zType('APP_IS_CONNECTED'), payload: z.optional(FrameSession) }))

    .or(z.object({ type: zType('APP_GET_CHAIN_ID') }))

    .or(
      z.object({
        type: zType('APP_RPC_REQUEST'),
        payload: RpcPersonalSignRequest.or(RpcEthSendTransactionRequest)
          .or(RpcEthAccountsRequest)
          .or(RpcGetBalance)
          .or(RpcEthEstimateGas)
          .or(RpcEthGasPrice)
          .or(RpcEthSignTypedDataV4)
          .or(RpcEthBlockNumber)
          .or(RpcEthChainId)
          .or(RpcEthGetTransactionByHash)
      })
    )

    .or(z.object({ type: zType('APP_UPDATE_EMAIL'), payload: AppUpdateEmailRequest }))

    .or(z.object({ type: zType('APP_AWAIT_UPDATE_EMAIL') }))

    .or(z.object({ type: zType('APP_SYNC_THEME'), payload: AppSyncThemeRequest }))

    .or(z.object({ type: zType('APP_SYNC_DAPP_DATA'), payload: AppSyncDappDataRequest })),

  // -- Frame Events ---------------------------------------------------------
  frameEvent: z
    .object({ type: zType('FRAME_SWITCH_NETWORK_ERROR'), payload: zError })

    .or(
      z.object({ type: zType('FRAME_SWITCH_NETWORK_SUCCESS'), payload: FrameSwitchNetworkResponse })
    )

    .or(z.object({ type: zType('FRAME_CONNECT_EMAIL_ERROR'), payload: zError }))

    .or(
      z.object({ type: zType('FRAME_CONNECT_EMAIL_SUCCESS'), payload: FrameConnectEmailResponse })
    )

    .or(z.object({ type: zType('FRAME_CONNECT_OTP_ERROR'), payload: zError }))

    .or(z.object({ type: zType('FRAME_CONNECT_OTP_SUCCESS') }))

    .or(z.object({ type: zType('FRAME_CONNECT_DEVICE_ERROR'), payload: zError }))

    .or(z.object({ type: zType('FRAME_CONNECT_DEVICE_SUCCESS') }))

    .or(z.object({ type: zType('FRAME_GET_USER_ERROR'), payload: zError }))

    .or(z.object({ type: zType('FRAME_GET_USER_SUCCESS'), payload: FrameGetUserResponse }))

    .or(z.object({ type: zType('FRAME_SIGN_OUT_ERROR'), payload: zError }))

    .or(z.object({ type: zType('FRAME_SIGN_OUT_SUCCESS') }))

    .or(z.object({ type: zType('FRAME_IS_CONNECTED_ERROR'), payload: zError }))

    .or(z.object({ type: zType('FRAME_IS_CONNECTED_SUCCESS'), payload: FrameIsConnectedResponse }))

    .or(z.object({ type: zType('FRAME_GET_CHAIN_ID_ERROR'), payload: zError }))

    .or(z.object({ type: zType('FRAME_GET_CHAIN_ID_SUCCESS'), payload: FrameGetChainIdResponse }))

    .or(z.object({ type: zType('FRAME_RPC_REQUEST_ERROR'), payload: zError }))

    .or(z.object({ type: zType('FRAME_RPC_REQUEST_SUCCESS'), payload: RpcResponse }))

    .or(z.object({ type: zType('FRAME_SESSION_UPDATE'), payload: FrameSession }))

    .or(z.object({ type: zType('FRAME_UPDATE_EMAIL_ERROR'), payload: zError }))

    .or(z.object({ type: zType('FRAME_UPDATE_EMAIL_SUCCESS') }))

    .or(z.object({ type: zType('FRAME_AWAIT_UPDATE_EMAIL_ERROR'), payload: zError }))

    .or(
      z.object({
        type: zType('FRAME_AWAIT_UPDATE_EMAIL_SUCCESS'),
        payload: FrameAwaitUpdateEmailResponse
      })
    )

    .or(z.object({ type: zType('FRAME_SYNC_THEME_ERROR'), payload: zError }))

    .or(z.object({ type: zType('FRAME_SYNC_THEME_SUCCESS') }))

    .or(z.object({ type: zType('FRAME_SYNC_DAPP_DATA_ERROR'), payload: zError }))

    .or(z.object({ type: zType('FRAME_SYNC_DAPP_DATA_SUCCESS') }))
}

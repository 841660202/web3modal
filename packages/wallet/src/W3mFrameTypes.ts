/*
 * Zod 用来定义数据结构，这里定义了一些请求和响应的数据结构，然后在其他地方使用这些数据结构。
 * 这样做的好处是，如果数据结构发生变化，只需要修改一处即可，而不需要在所有使用到这个数据结构的地方都修改。
 *
 *
 *
 * `zod` 是一个 TypeScript 和 JavaScript 的库，它用于创建、解析和验证数据结构。其主要作用是提供一种声明式和类型安全的方式来确保运行时数据的结构和类型符合预期。这对于在动态语言中增加类型安全性尤其有用。
 *
 * 以下是 `zod` 的一些主要特点和作用：
 *
 * 1. **类型推断**：`zod` 允许你定义数据的模式，然后自动为这些模式推断 TypeScript 类型。这意味着你不必手动编写接口或类型定义，因为 `zod` 会根据模式生成它们。
 *
 * 2. **运行时验证**：`zod` 提供的模式用于运行时数据验证。这对于验证外部源（如用户输入、API 响应等）的数据尤其重要。
 *
 * 3. **类型守卫**：`zod` 可以用作类型守卫，确保在编译时和运行时数据都符合预期的类型。
 *
 * 4. **错误处理**：在数据验证失败时，`zod` 会生成详细的错误报告，你可以用这些信息来通知用户或记录问题。
 *
 * 5. **组合和扩展**：`zod` 模式可以组合和扩展，这使得构建复杂和重用的数据验证器变得容易。
 *
 * 6. **自定义验证**：除了内置的验证器外，`zod` 还允许你定义自己的自定义验证函数，以实现更复杂的验证逻辑。
 *
 * 7. **解析和转换**：`zod` 可以在验证数据的同时对其进行解析和转换，这样你可以确保消费的数据是正确的格式。
 *
 * `zod` 的使用可以提高应用程序的健壮性，因为它减少了由于意外的无效数据导致的运行时错误。在与 TypeScript 结合使用时，它还可以增强代码的可读性和可维护性，因为数据模式和类型定义在同一个地方声明。
 */
import { z } from 'zod'
import {
  W3mFrameSchema,
  AppConnectEmailRequest,
  AppConnectOtpRequest,
  AppSwitchNetworkRequest,
  FrameConnectEmailResponse,
  FrameGetChainIdResponse,
  FrameGetUserResponse,
  FrameIsConnectedResponse,
  RpcPersonalSignRequest,
  RpcResponse,
  RpcEthSendTransactionRequest,
  RpcEthSignTypedDataV4,
  RpcEthAccountsRequest,
  RpcEthEstimateGas,
  RpcEthGasPrice,
  RpcGetBalance,
  RpcEthBlockNumber,
  FrameSession,
  AppGetUserRequest,
  AppUpdateEmailRequest,
  FrameAwaitUpdateEmailResponse,
  AppSyncThemeRequest,
  RpcEthChainId,
  FrameSwitchNetworkResponse,
  AppSyncDappDataRequest,
  RpcEthGetTransactionByHash
} from './W3mFrameSchema.js'

export namespace W3mFrameTypes {
  export type AppEvent = z.infer<typeof W3mFrameSchema.appEvent>

  export type FrameEvent = z.infer<typeof W3mFrameSchema.frameEvent>

  export interface Requests {
    AppConnectEmailRequest: z.infer<typeof AppConnectEmailRequest>
    AppConnectOtpRequest: z.infer<typeof AppConnectOtpRequest>
    AppSwitchNetworkRequest: z.infer<typeof AppSwitchNetworkRequest>
    AppGetUserRequest: z.infer<typeof AppGetUserRequest>
    AppUpdateEmailRequest: z.infer<typeof AppUpdateEmailRequest>
    AppSyncThemeRequest: z.infer<typeof AppSyncThemeRequest>
    AppSyncDappDataRequest: z.infer<typeof AppSyncDappDataRequest>
  }

  export interface Responses {
    FrameConnectEmailResponse: z.infer<typeof FrameConnectEmailResponse>
    FrameGetChainIdResponse: z.infer<typeof FrameGetChainIdResponse>
    FrameGetUserResponse: z.infer<typeof FrameGetUserResponse>
    FrameIsConnectedResponse: z.infer<typeof FrameIsConnectedResponse>
    FrameAwaitUpdateEmailResponse: z.infer<typeof FrameAwaitUpdateEmailResponse>
    FrameSwitchNetworkResponse: z.infer<typeof FrameSwitchNetworkResponse>
  }

  export interface Network {
    rpcUrl: string
    chainId: number
  }

  export type RPCRequest =
    | z.infer<typeof RpcPersonalSignRequest>
    | z.infer<typeof RpcEthSendTransactionRequest>
    | z.infer<typeof RpcEthSignTypedDataV4>
    | z.infer<typeof RpcEthAccountsRequest>
    | z.infer<typeof RpcEthEstimateGas>
    | z.infer<typeof RpcEthGasPrice>
    | z.infer<typeof RpcGetBalance>
    | z.infer<typeof RpcEthBlockNumber>
    | z.infer<typeof RpcEthChainId>
    | z.infer<typeof RpcEthGetTransactionByHash>

  export type RPCResponse = z.infer<typeof RpcResponse>

  export type FrameSessionType = z.infer<typeof FrameSession>
}

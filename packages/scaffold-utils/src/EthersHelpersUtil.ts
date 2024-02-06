import type { CaipNetwork } from '@web3modal/scaffold'
import { ConstantsUtil } from './ConstantsUtil.js'
import { PresetsUtil } from './PresetsUtil.js'
import type { Chain, Provider } from './EthersTypesUtil.js'
// 这段代码定义了一个名为 `EthersHelpersUtil` 的 JavaScript 对象，它包含了一系列与以太坊相关的帮助函数。这些函数主要用于与 Web3 提供者接口交互，执行常见的任务，如获取当前链 ID、用户地址、转换数值格式，以及添加新的以太坊链到用户的钱包。它利用了 TypeScript 的类型导入功能，确保类型安全。

// 下面是每个函数的简要说明：

// 1. `getCaipDefaultChain(chain?: Chain)`: 这个函数接受一个可选的 `Chain` 类型的参数，返回一个符合 CAIP（Chain Agnostic Improvement Proposal）标准的默认链对象。如果没有提供链参数，则返回 `undefined`。

// 2. `hexStringToNumber(value: string)`: 将十六进制字符串转换为数字。如果字符串以 `0x` 开头，它会先移除这个前缀。

// 3. `numberToHexString(value: number)`: 将数字转换为十六进制字符串，并确保字符串以 `0x` 开头。

// 4. `getUserInfo(provider: Provider)`: 异步函数，获取用户的地址和链 ID。它使用 `Promise.all` 来同时执行 `getAddress` 和 `getChainId` 函数。

// 5. `getChainId(provider: Provider)`: 异步函数，通过调用提供者的 `request` 方法，使用 `eth_chainId` JSON-RPC 调用来获取当前的链 ID。

// 6. `getAddress(provider: Provider)`: 异步函数，通过调用提供者的 `request` 方法，使用 `eth_accounts` JSON-RPC 调用来获取用户的以太坊地址。

// 7. `addEthereumChain(provider: Provider, chain: Chain)`: 异步函数，通过调用提供者的 `request` 方法，使用 `wallet_addEthereumChain` JSON-RPC 调用来添加一个新的以太坊链到用户的钱包。它设置了链的 ID、RPC URL、名称、本地货币信息、区块浏览器 URL 和图标 URL。

// 这个工具对象依赖于 `ConstantsUtil` 和 `PresetsUtil` 两个模块，这两个模块可能包含了一些常量和预设配置，例如 `EIP155` 的值和链 ID 对应的图标 ID。

// 整体来说，`EthersHelpersUtil` 是一个与以太坊钱包交互的实用工具集，它简化了执行常见 Web3 操作的过程。通过使用 TypeScript，它还提供了类型安全，有助于在开发过程中避免类型错误。
export const EthersHelpersUtil = {
  getCaipDefaultChain(chain?: Chain) {
    if (!chain) {
      return undefined
    }

    return {
      id: `${ConstantsUtil.EIP155}:${chain.chainId}`,
      name: chain.name,
      imageId: PresetsUtil.EIP155NetworkImageIds[chain.chainId]
    } as CaipNetwork
  },
  hexStringToNumber(value: string) {
    const string = value.startsWith('0x') ? value.slice(2) : value
    const number = parseInt(string, 16)

    return number
  },
  numberToHexString(value: number) {
    return `0x${value.toString(16)}`
  },
  async getUserInfo(provider: Provider) {
    const [address, chainId] = await Promise.all([
      EthersHelpersUtil.getAddress(provider),
      EthersHelpersUtil.getChainId(provider)
    ])

    return { chainId, address }
  },
  async getChainId(provider: Provider) {
    const chainId = await provider.request<string | number>({ method: 'eth_chainId' })

    return Number(chainId)
  },
  async getAddress(provider: Provider) {
    const [address] = await provider.request<string[]>({ method: 'eth_accounts' })

    return address
  },
  async addEthereumChain(provider: Provider, chain: Chain) {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: EthersHelpersUtil.numberToHexString(chain.chainId),
          rpcUrls: [chain.rpcUrl],
          chainName: chain.name,
          nativeCurrency: {
            name: chain.currency,
            decimals: 18,
            symbol: chain.currency
          },
          blockExplorerUrls: [chain.explorerUrl],
          iconUrls: [PresetsUtil.EIP155NetworkImageIds[chain.chainId]]
        }
      ]
    })
  }
}

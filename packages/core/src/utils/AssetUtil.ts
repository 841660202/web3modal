import { AssetController } from '../controllers/AssetController.js'
import type { CaipNetwork, Connector, WcWallet } from './TypeUtil.js'

export const AssetUtil = {
  getWalletImage(wallet?: WcWallet) {
    if (wallet?.image_url) {
      return wallet?.image_url
    }

    if (wallet?.image_id) {
      return AssetController.state.walletImages[wallet.image_id]
    }

    return undefined
  },

  getNetworkImage(network?: CaipNetwork) {
    if (network?.imageUrl) {
      return network?.imageUrl
    }

    if (network?.imageId) {
      return AssetController.state.networkImages[network.imageId]
    }

    return undefined
  },

  getConnectorImage(connector?: Connector) {
    if (connector?.imageUrl) {
      return connector.imageUrl
    }
    // 发起网络请求获取图片
    if (connector?.imageId) {
      return AssetController.state.connectorImages[connector.imageId]
    }

    return undefined
  }
}

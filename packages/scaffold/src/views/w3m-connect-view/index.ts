import type { Connector, WcWallet } from '@web3modal/core'
import {
  ApiController,
  AssetUtil,
  ConnectionController,
  ConnectorController,
  CoreHelperUtil,
  EventsController,
  OptionsController,
  RouterController,
  StorageUtil,
  ConstantsUtil
} from '@web3modal/core'
import { customElement } from '@web3modal/ui'
import { LitElement, html } from 'lit'
import { state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import styles from './styles.js'

@customElement('w3m-connect-view')
export class W3mConnectView extends LitElement {
  public static override styles = styles

  // -- Members ------------------------------------------- //
  private unsubscribe: (() => void)[] = []

  // -- State & Properties -------------------------------- //
  @state() private connectors = ConnectorController.state.connectors

  public constructor() {
    super()
    this.unsubscribe.push(
      ConnectorController.subscribeKey('connectors', val => (this.connectors = val))
    )
  }

  public override disconnectedCallback() {
    this.unsubscribe.forEach(unsubscribe => unsubscribe())
  }

  // -- Render -------------------------------------------- //
  public override render() {
    return html`
      <wui-flex flexDirection="column" padding="s" gap="xs">
        <w3m-email-login-widget></w3m-email-login-widget>
        <!--  -->
        ${this.walletConnectConnectorTemplate()}
        <!--  -->
        <p>recentTemplate</p>
        ${this.recentTemplate()}
        <!--  -->
        <p>announcedTemplate</p>
        ${this.announcedTemplate()}
        <!--  -->
        <p>injectedTemplate</p>
        ${this.injectedTemplate()}
        <!--  -->
        <p>featuredTemplate</p>
        ${this.featuredTemplate()}
        <!--  -->
        <p>customTemplate</p>
        ${this.customTemplate()}
        <!--  -->
        <p>recommendedTemplate</p>
        ${this.recommendedTemplate()}
        <!--  -->
        <p>connectorsTemplate</p>
        ${this.connectorsTemplate()}
        <!-- All Wallets -->
        <p>allWalletsTemplate</p>
        ${this.allWalletsTemplate()}
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `
  }

  // -- Private ------------------------------------------- //
  private walletConnectConnectorTemplate() {
    if (CoreHelperUtil.isMobile()) {
      return null
    }

    const connector = this.connectors.find(c => c.type === 'WALLET_CONNECT')
    if (!connector) {
      return null
    }

    return html`
      <wui-list-wallet
        imageSrc=${ifDefined(AssetUtil.getConnectorImage(connector))}
        name=${connector.name ?? 'Unknown'}
        @click=${() => this.onConnector(connector)}
        tagLabel="qr code"
        tagVariant="main"
        data-testid="wallet-selector-walletconnect"
      >
      </wui-list-wallet>
    `
  }

  private customTemplate() {
    const { customWallets } = OptionsController.state
    if (!customWallets?.length) {
      return null
    }
    const wallets = this.filterOutDuplicateWallets(customWallets)

    return wallets.map(
      wallet => html`
        <wui-list-wallet
          imageSrc=${ifDefined(AssetUtil.getWalletImage(wallet))}
          name=${wallet.name ?? 'Unknown'}
          @click=${() => this.onConnectWallet(wallet)}
        >
        </wui-list-wallet>
      `
    )
  }

  private featuredTemplate() {
    const connector = this.connectors.find(c => c.type === 'WALLET_CONNECT')
    if (!connector) {
      return null
    }
    const { featured } = ApiController.state
    if (!featured.length) {
      return null
    }
    const wallets = this.filterOutDuplicateWallets(featured)

    return wallets.map(
      wallet => html`
        <wui-list-wallet
          imageSrc=${ifDefined(AssetUtil.getWalletImage(wallet))}
          name=${wallet.name ?? 'Unknown'}
          @click=${() => this.onConnectWallet(wallet)}
        >
        </wui-list-wallet>
      `
    )
  }

  private recentTemplate() {
    const recent = StorageUtil.getRecentWallets()

    return recent.map(
      wallet => html`
        <wui-list-wallet
          imageSrc=${ifDefined(AssetUtil.getWalletImage(wallet))}
          name=${wallet.name ?? 'Unknown'}
          @click=${() => this.onConnectWallet(wallet)}
          tagLabel="recent"
          tagVariant="shade"
        >
        </wui-list-wallet>
      `
    )
  }

  private announcedTemplate() {
    return this.connectors.map(connector => {
      if (connector.type !== 'ANNOUNCED') {
        return null
      }

      return html`
        <wui-list-wallet
          imageSrc=${ifDefined(AssetUtil.getConnectorImage(connector))}
          name=${connector.name ?? 'Unknown'}
          @click=${() => this.onConnector(connector)}
          tagVariant="success"
          .installed=${true}
        >
        </wui-list-wallet>
      `
    })
  }

  private injectedTemplate() {
    const announced = this.connectors.find(c => c.type === 'ANNOUNCED')

    return this.connectors.map(connector => {
      console.log('connector', connector)
      if (connector.type !== 'INJECTED') {
        return null
      }

      if (!ConnectionController.checkInstalled()) {
        return null
      }
      const img = ifDefined(AssetUtil.getConnectorImage(connector))
      console.log('img', img)
      /*
       * Blob:http://localhost:3001/db818fec-d073-43ee-965c-5d9d38601673
       * 这个数据是由 URL.createObjectURL() 创建的 URL 对象
       */

      return html`
        <wui-list-wallet
          imageSrc=${img}
          .installed=${Boolean(announced)}
          name=${connector.name ?? 'Unknown'}
          @click=${() => this.onConnector(connector)}
        >
        </wui-list-wallet>
      `
    })
  }

  private connectorsTemplate() {
    const announcedRdns = ConnectorController.getAnnouncedConnectorRdns()

    return this.connectors.map(connector => {
      if (['WALLET_CONNECT', 'INJECTED', 'ANNOUNCED', 'EMAIL'].includes(connector.type)) {
        return null
      }

      if (announcedRdns.includes(ConstantsUtil.CONNECTOR_RDNS_MAP[connector.id])) {
        return null
      }

      return html`
        <wui-list-wallet
          imageSrc=${ifDefined(AssetUtil.getConnectorImage(connector))}
          name=${connector.name ?? 'Unknown'}
          @click=${() => this.onConnector(connector)}
        >
        </wui-list-wallet>
      `
    })
  }

  private allWalletsTemplate() {
    const connector = this.connectors.find(c => c.type === 'WALLET_CONNECT')
    if (!connector) {
      return null
    }

    const count = ApiController.state.count
    const featuredCount = ApiController.state.featured.length
    const rawCount = count + featuredCount
    const roundedCount = rawCount < 10 ? rawCount : Math.floor(rawCount / 10) * 10
    const tagLabel = roundedCount < rawCount ? `${roundedCount}+` : `${roundedCount}`

    return html`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${tagLabel}
        tagVariant="shade"
        data-testid="all-wallets"
      ></wui-list-wallet>
    `
  }

  private recommendedTemplate() {
    const connector = this.connectors.find(c => c.type === 'WALLET_CONNECT')
    if (!connector) {
      return null
    }
    const { recommended } = ApiController.state
    const { customWallets, featuredWalletIds } = OptionsController.state
    const { connectors } = ConnectorController.state
    const recent = StorageUtil.getRecentWallets()
    const eip6963 = connectors.filter(c => c.type === 'ANNOUNCED')
    if (featuredWalletIds || customWallets || !recommended.length) {
      return null
    }

    const overrideLength = eip6963.length + recent.length
    console.log('overrideLength', overrideLength)
    const maxRecommended = Math.max(0, 2 - overrideLength)
    console.log('recommended', recommended)
    const wallets = this.filterOutDuplicateWallets(recommended).slice(0, maxRecommended)

    return wallets.map(
      wallet => html`
        <wui-list-wallet
          imageSrc=${ifDefined(AssetUtil.getWalletImage(wallet))}
          name=${wallet?.name ?? 'Unknown'}
          @click=${() => this.onConnectWallet(wallet)}
        >
        </wui-list-wallet>
      `
    )
  }

  // -- Private Methods ----------------------------------- //
  private onConnector(connector: Connector) {
    if (connector.type === 'WALLET_CONNECT') {
      if (CoreHelperUtil.isMobile()) {
        RouterController.push('AllWallets')
      } else {
        RouterController.push('ConnectingWalletConnect')
      }
    } else {
      RouterController.push('ConnectingExternal', { connector })
    }
  }
  // 过滤掉重复的钱包
  private filterOutDuplicateWallets(wallets: WcWallet[]) {
    const { connectors } = ConnectorController.state
    const recent = StorageUtil.getRecentWallets()
    const recentIds = recent.map(wallet => wallet.id)
    const rdnsIds = connectors.map(c => c.info?.rdns).filter(Boolean)
    const filtered = wallets.filter(
      wallet => !recentIds.includes(wallet.id) && !rdnsIds.includes(wallet.rdns ?? undefined)
    )

    return filtered
  }

  private onAllWallets() {
    EventsController.sendEvent({ type: 'track', event: 'CLICK_ALL_WALLETS' })
    RouterController.push('AllWallets')
  }

  private onConnectWallet(wallet: WcWallet) {
    RouterController.push('ConnectingWalletConnect', { wallet })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'w3m-connect-view': W3mConnectView
  }
}

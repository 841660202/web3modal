import { W3mFrameStorage } from './W3mFrameStorage.js'
import { W3mFrameConstants } from './W3mFrameConstants.js'
// 限制的时区
const RESTRICTED_TIMEZONES = [
  'ASIA/SHANGHAI',
  'ASIA/URUMQI',
  'ASIA/CHONGQING',
  'ASIA/HARBIN',
  'ASIA/KASHGAR',
  'ASIA/MACAU',
  'ASIA/HONG_KONG',
  'ASIA/MACAO',
  'ASIA/BEIJING',
  'ASIA/HARBIN'
]
//  电子邮件最小超时
const EMAIL_MINIMUM_TIMEOUT = 30 * 1000
/*
 * W3mFrameHelpers 三个方法，分别用来：
 * 1. 获取区块链 API URL、
 * 2. 检查是否允许触发电子邮件
 * 3. 获取下一个电子邮件登录的时间。
 */
export const W3mFrameHelpers = {
  getBlockchainApiUrl() {
    try {
      const { timeZone } = new Intl.DateTimeFormat().resolvedOptions()
      const capTimeZone = timeZone.toUpperCase()

      return RESTRICTED_TIMEZONES.includes(capTimeZone)
        ? 'https://rpc.walletconnect.org'
        : 'https://rpc.walletconnect.com'
    } catch {
      return false
    }
  },
  // 如果上次电子邮件登录时间存在，且当前时间与上次登录时间的差值小于电子邮件最小超时，则抛出错误。
  checkIfAllowedToTriggerEmail() {
    const lastEmailLoginTime = W3mFrameStorage.get(W3mFrameConstants.LAST_EMAIL_LOGIN_TIME)
    if (lastEmailLoginTime) {
      const difference = Date.now() - Number(lastEmailLoginTime)
      if (difference < EMAIL_MINIMUM_TIMEOUT) {
        const cooldownSec = Math.ceil((EMAIL_MINIMUM_TIMEOUT - difference) / 1000)
        throw new Error(`Please try again after ${cooldownSec} seconds`)
      }
    }
  },
  // 如果上次电子邮件登录时间存在，且当前时间与上次登录时间的差值小于电子邮件最小超时，则返回下一个电子邮件登录的时间。
  getTimeToNextEmailLogin() {
    const lastEmailLoginTime = W3mFrameStorage.get(W3mFrameConstants.LAST_EMAIL_LOGIN_TIME)
    if (lastEmailLoginTime) {
      const difference = Date.now() - Number(lastEmailLoginTime)
      if (difference < EMAIL_MINIMUM_TIMEOUT) {
        return Math.ceil((EMAIL_MINIMUM_TIMEOUT - difference) / 1000)
      }
    }

    return 0
  }
}

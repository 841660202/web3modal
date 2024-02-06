/* eslint-disable no-bitwise */
import type { SpacingType, ThemeType, TruncateOptions } from './TypeUtil.js'

export const UiHelperUtil = {
  /*
   * 这个函数接受一个 spacing 参数，它可以是一个 SpacingType 类型的单个值或者一个 SpacingType 类型的数组。
   * 如果是数组，函数会根据提供的索引 index 返回对应的 CSS 变量。
   * 如果是字符串，它会返回一个 CSS 变量。如果没有提供有效的间距，它将返回 undefined
   */
  getSpacingStyles(spacing: SpacingType | SpacingType[], index: number) {
    if (Array.isArray(spacing)) {
      return spacing[index] ? `var(--wui-spacing-${spacing[index]})` : undefined
    } else if (typeof spacing === 'string') {
      return `var(--wui-spacing-${spacing})`
    }

    return undefined
  },
  // 这个函数接受一个 Date 对象，并使用 Intl.DateTimeFormat 来格式化日期，返回格式为月份缩写和日期的字符串
  getFormattedDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
  },
  // 这个函数解析一个 URL 字符串并返回其主机名部分
  getHostName(url: string) {
    const newUrl = new URL(url)

    return newUrl.hostname
  },
  /*
   * 该函数用于截断字符串。它接受一个对象，包含要截断的字符串、开始保留的字符数、
   * 结束保留的字符数以及截断的位置（开始或结束）。根据这些参数，函数返回截断后带有省略号的字符串。
   */
  getTruncateString({ string, charsStart, charsEnd, truncate }: TruncateOptions) {
    if (string.length <= charsStart + charsEnd) {
      return string
    }

    if (truncate === 'end') {
      return `${string.substring(0, charsStart)}...`
    } else if (truncate === 'start') {
      return `...${string.substring(string.length - charsEnd)}`
    }

    return `${string.substring(0, Math.floor(charsStart))}...${string.substring(
      string.length - Math.floor(charsEnd)
    )}`
  },
  /*
   * 这个函数根据提供的地址字符串生成一系列的颜色。它首先将地址转换为小写并去除前缀（如果有的话），
   * 然后从地址中提取颜色值，将其转换为 RGB 值，并根据这个颜色生成一系列渐变色。
   */
  generateAvatarColors(address: string) {
    const hash = address.toLowerCase().replace(/^0x/iu, '')
    const baseColor = hash.substring(0, 6)
    const rgbColor = this.hexToRgb(baseColor)
    const masterBorderRadius = getComputedStyle(document.documentElement).getPropertyValue(
      '--w3m-border-radius-master'
    )
    const radius = Number(masterBorderRadius?.replace('px', ''))
    const edge = 100 - 3 * radius

    const gradientCircle = `${edge}% ${edge}% at 65% 40%`

    const colors: string[] = []

    for (let i = 0; i < 5; i += 1) {
      const tintedColor = this.tintColor(rgbColor, 0.15 * i)
      colors.push(`rgb(${tintedColor[0]}, ${tintedColor[1]}, ${tintedColor[2]})`)
    }

    return `
    --local-color-1: ${colors[0]};
    --local-color-2: ${colors[1]};
    --local-color-3: ${colors[2]};
    --local-color-4: ${colors[3]};
    --local-color-5: ${colors[4]};
    --local-radial-circle: ${gradientCircle}
   `
  },
  // 这个函数将一个十六进制颜色值转换为一个 RGB 颜色数组
  hexToRgb(hex: string): [number, number, number] {
    const bigint = parseInt(hex, 16)

    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    return [r, g, b]
  },
  // 这个函数接受一个 RGB 颜色数组和一个调整值，用于调整颜色的亮度
  tintColor(rgb: [number, number, number], tint: number): [number, number, number] {
    const [r, g, b] = rgb
    const tintedR = Math.round(r + (255 - r) * tint)
    const tintedG = Math.round(g + (255 - g) * tint)
    const tintedB = Math.round(b + (255 - b) * tint)

    return [tintedR, tintedG, tintedB]
  },
  // 这个函数检测一个字符串是否仅由数字组成
  isNumber(character: string) {
    const regex = {
      number: /^[0-9]+$/u
    }

    return regex.number.test(character)
  },
  /*
   * 这个函数用于获取颜色主题。如果提供了 theme 参数，它将返回该主题；
   * 否则，它会检查浏览器的颜色方案偏好设置，并返回相应的 'dark' 或 'light' 主题。
   */
  getColorTheme(theme: ThemeType | undefined) {
    if (theme) {
      return theme
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }

      return 'light'
    }

    return 'dark'
  }
}

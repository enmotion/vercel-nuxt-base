/**
 * 主题系统组合式函数
 */
export function useTheme() {
  const colorMode = useColorMode()
  const primaryColor = useState('primaryColor', () => '#3b82f6') // 默认蓝色

  // 预设主题色
  const presetColors = [
    { name: 'Ocean Blue', value: '#3b82f6' },
    { name: 'Emerald Green', value: '#10b981' },
    { name: 'Violet Purple', value: '#8b5cf6' },
    { name: 'Sunset Orange', value: '#f97316' },
    { name: 'Zinc Neutral', value: '#71717a' },
  ]

  // 初始化主题色
  onMounted(() => {
    const saved = localStorage.getItem('primaryColor')
    if (saved) {
      primaryColor.value = saved
      updateCSSVariables(saved)
    }
  })

  // 切换 Light/Dark 模式
  const toggleColorMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  // 设置颜色模式
  const setColorMode = (mode: 'light' | 'dark' | 'system') => {
    colorMode.preference = mode
  }

  // 设置主题色
  const setPrimaryColor = (color: string) => {
    primaryColor.value = color
    if (import.meta.client) {
      localStorage.setItem('primaryColor', color)
      updateCSSVariables(color)
    }
  }

  // 更新 CSS 变量
  const updateCSSVariables = (color: string) => {
    const hsl = hexToHSL(color)
    document.documentElement.style.setProperty('--primary', hsl)
    // 更新 ring 颜色
    document.documentElement.style.setProperty('--ring', hsl)
  }

  // HEX 转 HSL
  const hexToHSL = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '221.2 83.2% 53.3%'

    const r = parseInt(result[1]!, 16) / 255
    const g = parseInt(result[2]!, 16) / 255
    const b = parseInt(result[3]!, 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
  }

  return {
    colorMode,
    primaryColor: readonly(primaryColor),
    presetColors,
    toggleColorMode,
    setColorMode,
    setPrimaryColor,
  }
}

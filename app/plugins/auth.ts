export default defineNuxtPlugin(async () => {
  const { initialize, setupAuthListener } = useAuth()
  
  // 初始化认证状态
  await initialize()
  
  // 设置监听器
  if (import.meta.client) {
    setupAuthListener()
  }
})

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  const localePath = useLocalePath()
  
  // 如果访问 admin 页面但未登录，重定向到登录页
  if (to.path.startsWith('/admin') || to.path.includes('/admin')) {
    if (!isAuthenticated.value) {
      return navigateTo(localePath('/auth/login'))
    }
  }
})

import type { User, Session } from '@supabase/supabase-js'

export const useAuth = () => {
  const supabase = useSupabase()
  const user = useState<User | null>('user', () => null)
  const session = useState<Session | null>('session', () => null)
  const loading = useState('authLoading', () => true)

  // 初始化认证状态
  const initialize = async () => {
    loading.value = true
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      session.value = currentSession
      user.value = currentSession?.user ?? null
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      loading.value = false
    }
  }

  // 监听认证状态变化
  const setupAuthListener = () => {
    supabase.auth.onAuthStateChange((event, currentSession) => {
      session.value = currentSession
      user.value = currentSession?.user ?? null
    })
  }

  // 登录
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    user.value = data.user
    session.value = data.session
    
    return data
  }

  // 注册
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    
    return data
  }

  // 登出
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error
    
    user.value = null
    session.value = null
  }

  // 重置密码
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    
    if (error) throw error
    
    return data
  }

  // 检查是否已登录
  const isAuthenticated = computed(() => !!user.value)

  // 检查是否是管理员
  const isAdmin = computed(() => {
    // 这里可以根据用户的 profile 或 metadata 判断
    return !!user.value
  })

  return {
    user: readonly(user),
    session: readonly(session),
    loading: readonly(loading),
    isAuthenticated,
    isAdmin,
    initialize,
    setupAuthListener,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
}

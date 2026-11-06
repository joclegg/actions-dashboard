import { useSession } from '@/common/auth.hooks'
import { DashboardView } from '@/views/DashboardView/DashboardView'
import { SignInView } from '@/views/SignInView/SignInView'

export function AppView() {
  const { session, error, signingIn, signIn, signOut, token } = useSession()

  if (!session) {
    return <SignInView error={error} signingIn={signingIn} onSignIn={signIn} />
  }
  return <DashboardView getToken={token} onSignOut={signOut} />
}

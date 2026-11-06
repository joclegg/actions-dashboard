import { LogIn } from 'lucide-react'

import { Button } from '@/components/Button/Button'
import { BUTTON_VARIANT } from '@/components/Button/Button.constants'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'

export function SignInView({
  error,
  signingIn,
  onSignIn,
}: {
  error: string | null
  signingIn: boolean
  onSignIn: () => void
}) {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-6 px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-2xl font-semibold">Actions dashboard</h1>
      <p className="text-muted-foreground">
        Every GitHub Actions run across a user&apos;s or organisation&apos;s
        repositories, on one page. Failures first.
      </p>
      <p className="text-sm text-muted-foreground">
        Signing in asks for read-only access to Actions. Your token stays in
        this browser and is only sent to GitHub.
      </p>
      <Button
        variant={BUTTON_VARIANT.OUTLINE}
        className="h-10 self-start px-4"
        disabled={signingIn}
        onClick={onSignIn}
      >
        <LogIn />
        {signingIn ? 'Signing in…' : 'Sign in with GitHub'}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </main>
  )
}

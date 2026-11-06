export interface Session {
  accessToken: string
  refreshToken: string | null
  expiresAt: number | null
}

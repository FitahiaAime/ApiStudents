export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken?: string;
}

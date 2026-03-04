export interface LoginDto {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenExpiration: string;
  refreshTokenExpiration: string;
  petShop: {
    email: string;
    enderecoPetShop: string;
  };
}

export interface RefreshTokenDto {
  refreshToken: string;
}
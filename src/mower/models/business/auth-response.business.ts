export interface MowerAuthResponse {
  access_token: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
  provider: string;
  user_id: string;
  token_type: string;
}

export interface AuthPayload {
  id: string;
  email: string;
  verified: boolean;
  accountType?: string;
}

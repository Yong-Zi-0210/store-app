export interface AccountLogin {
  account: string;
  password: string;
}

export interface VerifyCodeLogin {
  phone: string;
  verifyCode: string;
}

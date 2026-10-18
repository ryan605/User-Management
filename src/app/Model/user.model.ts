export class LoginModel {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}
export interface users{
  email: string;
  password: string;
  fullname: string;
  mobile: string;
}
import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { Home } from './components/home/home';
import { Signup } from './components/signup/signup';

export const routes: Routes = [
  {path: '', redirectTo:'login',pathMatch:'full'},
  {path:'login',component: LoginPage},
  {path:'signup',component: Signup},
  {path: 'home',component: Home}
];

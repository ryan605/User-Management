import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { Home } from './components/home/home';

export const routes: Routes = [
  {path: '', redirectTo:'login',pathMatch:'full'},
  {path:'login',component: LoginPage},
  {path: 'home',component: Home}
];

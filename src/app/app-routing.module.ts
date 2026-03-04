import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormLoginComponent } from './shared/form-login/form-login.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: FormLoginComponent },
  { 
    path: 'dashboard', 
    component: AppComponent,
    canActivate: [AuthGuard]  // ← Só carrega AppComponent se tiver token
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
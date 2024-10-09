import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeleteComponent } from './delete/delete.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UpdateComponent } from './update/update.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo:'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: "LoginPage",
        
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: "RegisterPage"
    },
    {
        path: 'update',
        component: UpdateComponent,
        title: "UpdatePage"
    },
    {
        path: 'delete',
        component: DeleteComponent,
        title: "DeletePage"
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        title: "DashboardPage"
    },
];

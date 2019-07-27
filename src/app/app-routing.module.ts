import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    { path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule' },
    { path: 'account', loadChildren: './modules/account/account.module#AccountModule' },
    { path: 'report', loadChildren: './modules/report/report.module#ReportModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

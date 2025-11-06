import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "",
    component: CustomLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadChildren: () => import("./layout/dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "insights",
        loadChildren: () => import("./layout/insights/insights.module").then((m) => m.InsightsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

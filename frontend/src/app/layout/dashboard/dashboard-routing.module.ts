import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { InboxComponent } from "./components/inbox/inbox.component";
import { MembersComponent } from "../members/members.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  {
    path: "inbox",
    component: InboxComponent,
  },
  {
    path: "members",
    component: MembersComponent,
  },
  {
    path: "mails",
    loadChildren: () =>
      import("../mails/mails.module").then((m) => m.MailsModule),
  },
  {
    path: "projects/:id/tasks",
    loadChildren: () =>
      import("../projects/tasks/tasks.module").then((m) => m.DashboardProjectTasksModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}

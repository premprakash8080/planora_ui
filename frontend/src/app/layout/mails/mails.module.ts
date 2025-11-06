import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailsRoutingModule } from './mails-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailViewComponent } from './mail-view/mail-view.component';

@NgModule({
  declarations: [
    MailListComponent,
    MailViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MailsRoutingModule
  ]
})
export class MailsModule { }

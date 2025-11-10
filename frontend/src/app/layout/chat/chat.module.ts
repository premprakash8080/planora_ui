import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { SharedUiModule } from '../../shared/ui/ui.module';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';

@NgModule({
  declarations: [ChatComponent, ChatSidebarComponent, ChatWindowComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedUiModule, ChatRoutingModule]
})
export class ChatModule {}

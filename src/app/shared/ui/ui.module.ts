import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppHeaderComponent } from './app-header/app-header.component';
import { AppSidebarComponent } from './app-sidebar/app-sidebar.component';
import { AppPageTitleComponent } from './app-page-title/app-page-title.component';
import { AppCardComponent } from './app-card/app-card.component';
import { AppButtonComponent } from './app-button/app-button.component';
import { AppTableComponent } from './app-table/app-table.component';
import { AppCalendarComponent } from './app-calendar/app-calendar.component';
import { AppDateRangePickerComponent } from './app-date-range-picker/app-date-range-picker.component';
import { AppAvatarComponent } from './app-avatar/app-avatar.component';
import { AppLoadingComponent } from './app-loading/app-loading.component';
import { AppPaginationComponent } from './app-pagination/app-pagination.component';
import { DropdownPopoverComponent } from './dropdown-popover/dropdown-popover.component';
import { DropdownTriggerDirective } from './dropdown-popover/dropdown-trigger.directive';
import { DropdownContentDirective } from './dropdown-popover/dropdown-content.directive';

import { AppInputComponent } from './app-input/app-input.component';
import { AppEditorComponent } from './app-editor/app-editor.component';
import { QuillModule } from 'ngx-quill';
import { BlockEditorComponent } from './block-editor/block-editor.component';
import { BlockComponent } from './block-editor/block/block.component';
import { SlashMenuComponent } from './block-editor/slash-menu/slash-menu.component';

@NgModule({
  declarations: [
    AppHeaderComponent,
    AppSidebarComponent,
    AppPageTitleComponent,
    AppCardComponent,
    AppButtonComponent,
    AppTableComponent,
    AppCalendarComponent,
    AppDateRangePickerComponent,
    AppAvatarComponent,
    AppLoadingComponent,
    AppPaginationComponent,
    DropdownPopoverComponent,
    DropdownTriggerDirective,
    DropdownContentDirective,
    AppInputComponent,
    AppEditorComponent,
    BlockEditorComponent,
    BlockComponent,
    SlashMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    OverlayModule,
    QuillModule.forRoot(),
    DragDropModule
  ],
  exports: [
    AppHeaderComponent,
    AppSidebarComponent,
    AppPageTitleComponent,
    AppCardComponent,
    AppButtonComponent,
    AppTableComponent,
    AppCalendarComponent,
    AppDateRangePickerComponent,
    AppAvatarComponent,
    AppLoadingComponent,
    AppPaginationComponent,
    DropdownPopoverComponent,
    DropdownTriggerDirective,
    DropdownContentDirective,
    AppInputComponent,
    AppEditorComponent,
    BlockEditorComponent,
    DragDropModule
  ]
})
export class SharedUiModule { }

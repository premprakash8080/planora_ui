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

<<<<<<< Updated upstream
=======
import { AppInputComponent } from './app-input/app-input.component';
import { AppEditorComponent } from './app-editor/app-editor.component';
import { QuillModule } from 'ngx-quill';
import { BlockEditorComponent } from './block-editor/block-editor.component';
import { BlockComponent } from './block-editor/block/block.component';
import { SlashMenuComponent } from './block-editor/slash-menu/slash-menu.component';
import { AppAsideComponent } from './app-aside/app-aside.component';

>>>>>>> Stashed changes
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
    DropdownContentDirective
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
<<<<<<< Updated upstream
    OverlayModule
=======
    OverlayModule,
    QuillModule.forRoot(),
    DragDropModule,
    AppAsideComponent
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    DropdownContentDirective
=======
    DropdownContentDirective,
    AppInputComponent,
    AppEditorComponent,
    BlockEditorComponent,
    AppAsideComponent,
    DragDropModule
>>>>>>> Stashed changes
  ]
})
export class SharedUiModule {}


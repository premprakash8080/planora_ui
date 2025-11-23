import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DocsRoutingModule } from './docs-routing.module';

import { DocsLayoutComponent } from './components/docs-layout/docs-layout.component';
import { DocSidebarComponent } from './components/doc-sidebar/doc-sidebar.component';
import { DocListComponent } from './components/doc-list/doc-list.component';
import { DocEditorComponent } from './components/doc-editor/doc-editor.component';
import { DocHeaderComponent } from './components/doc-header/doc-header.component';
import { DocPageTreeComponent } from './components/doc-page-tree/doc-page-tree.component';
import { DocTemplatePickerComponent } from './components/doc-template-picker/doc-template-picker.component';

import { SharedUiModule } from '../../shared/ui/ui.module';

@NgModule({
    declarations: [
        DocsLayoutComponent,
        DocSidebarComponent,
        DocListComponent,
        DocEditorComponent,
        DocHeaderComponent,
        DocPageTreeComponent,
        DocTemplatePickerComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        DocsRoutingModule,
        SharedUiModule
    ]
})
export class DocsModule { }

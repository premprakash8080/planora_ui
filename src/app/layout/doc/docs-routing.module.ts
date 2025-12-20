import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocsLayoutComponent } from './components/docs-layout/docs-layout.component';
import { DocListComponent } from './components/doc-list/doc-list.component';
import { DocEditorComponent } from './components/doc-editor/doc-editor.component';

const routes: Routes = [
    {
        path: '',
        component: DocsLayoutComponent,
        children: [
            { path: '', component: DocListComponent },
            { path: ':id', component: DocEditorComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocsRoutingModule { }

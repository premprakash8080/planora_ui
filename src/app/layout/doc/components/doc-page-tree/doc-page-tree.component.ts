import { Component, Input } from '@angular/core';
import { Doc } from '../../models/doc.model';

@Component({
    selector: 'app-doc-page-tree',
    templateUrl: './doc-page-tree.component.html',
    styleUrls: ['./doc-page-tree.component.scss']
})
export class DocPageTreeComponent {
    @Input() docs: Doc[] = [];
}

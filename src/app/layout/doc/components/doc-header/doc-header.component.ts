import { Component, Input } from '@angular/core';
import { Doc } from '../../models/doc.model';

@Component({
    selector: 'app-doc-header',
    templateUrl: './doc-header.component.html',
    styleUrls: ['./doc-header.component.scss']
})
export class DocHeaderComponent {
    @Input() doc: Doc | undefined;
}

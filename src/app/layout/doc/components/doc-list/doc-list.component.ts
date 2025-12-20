import { Component, OnInit } from '@angular/core';
import { DocsService } from '../../services/docs.service';

@Component({
    selector: 'app-doc-list',
    templateUrl: './doc-list.component.html',
    styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit {
    docs$ = this.docsService.docs$;

    constructor(private docsService: DocsService) { }

    ngOnInit(): void { }
}

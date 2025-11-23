import { Component, OnInit } from '@angular/core';
import { DocsService } from '../../services/docs.service';
import { Doc } from '../../models/doc.model';
import { SidebarSection, SidebarNavItem } from '../../../../shared/ui/app-sidebar/app-sidebar.component';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-doc-sidebar',
    templateUrl: './doc-sidebar.component.html',
    styleUrls: ['./doc-sidebar.component.scss']
})
export class DocSidebarComponent implements OnInit {
    sections$ = this.docsService.docs$.pipe(
        map(docs => {
            const sections: SidebarSection[] = [
                {
                    id: 'favorites',
                    title: 'Favorites',
                    collapsible: true,
                    items: [
                        { label: 'Meeting Notes', icon: 'star', route: '/docs/3' } // Mock favorite
                    ]
                },
                {
                    id: 'private',
                    title: 'Private',
                    collapsible: true,
                    items: docs.map(doc => ({
                        label: doc.title,
                        icon: doc.icon || 'description',
                        route: `/docs/${doc.id}`
                    }))
                }
            ];
            return sections;
        })
    );

    constructor(private docsService: DocsService) { }

    ngOnInit(): void { }
}

import { Component } from '@angular/core';

@Component({
    selector: 'app-docs-layout',
    templateUrl: './docs-layout.component.html',
    styleUrls: ['./docs-layout.component.scss']
})
export class DocsLayoutComponent {
    isSidebarOpen = true;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}

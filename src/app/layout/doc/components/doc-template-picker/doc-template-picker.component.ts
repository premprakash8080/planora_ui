import { Component } from '@angular/core';

@Component({
    selector: 'app-doc-template-picker',
    templateUrl: './doc-template-picker.component.html',
    styleUrls: ['./doc-template-picker.component.scss']
})
export class DocTemplatePickerComponent {
    templates = [
        { name: 'Empty Page', icon: '📄' },
        { name: 'Meeting Notes', icon: '📅' },
        { name: 'Project Overview', icon: '📋' },
        { name: 'To-Do List', icon: '✅' }
    ];
}

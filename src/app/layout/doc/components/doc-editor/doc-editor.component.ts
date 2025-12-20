import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocsService } from '../../services/docs.service';
import { Doc } from '../../models/doc.model';
import { Block } from '../../../../shared/ui/block-editor/models/block.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-doc-editor',
    templateUrl: './doc-editor.component.html',
    styleUrls: ['./doc-editor.component.scss']
})
export class DocEditorComponent implements OnInit {
    doc: Doc | undefined;

    constructor(
        private route: ActivatedRoute,
        private docsService: DocsService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            switchMap(params => {
                const id = params.get('id');
                if (id) {
                    return this.docsService.getDoc(id);
                }
                return of(undefined);
            })
        ).subscribe(doc => {
            this.doc = doc;
            // Initialize blocks if not present but content exists (migration scenario)
            if (this.doc && !this.doc.blocks && this.doc.content) {
                // TODO: Parse HTML content to blocks if needed, or just start fresh/keep as is.
                // For now, we'll let the block editor handle empty state or initial data.
            }
        });
    }

    onBlocksChange(blocks: Block[]): void {
        if (this.doc) {
            this.doc.blocks = blocks;
            // Also update content string for backward compatibility or search indexing if needed
            this.doc.content = JSON.stringify(blocks);
            // Save changes
            // this.docsService.updateDoc(this.doc).subscribe(); // Assuming updateDoc exists
        }
    }
}

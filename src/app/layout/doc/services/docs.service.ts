import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Doc } from '../models/doc.model';

@Injectable({
    providedIn: 'root'
})
export class DocsService {
    private docsSubject = new BehaviorSubject<Doc[]>([]);
    public docs$ = this.docsSubject.asObservable();

    constructor() {
        // Mock data for now
        this.loadMockDocs();
    }

    private loadMockDocs() {
        const mockDocs: Doc[] = [
            {
                id: '1',
                title: 'Getting Started',
                icon: '🚀',
                createdAt: new Date(),
                updatedAt: new Date(),
                content: '<h1>Welcome to Planora Docs!</h1><p>This is a getting started guide.</p>'
            },
            {
                id: '2',
                title: 'Project Overview',
                icon: '📋',
                createdAt: new Date(),
                updatedAt: new Date(),
                content: '<h1>Project Overview</h1><p>Details about the project...</p>',
                children: [
                    {
                        id: '2-1',
                        title: 'Requirements',
                        icon: '📝',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        parentId: '2'
                    }
                ]
            },
            {
                id: '3',
                title: 'Meeting Notes',
                icon: '📅',
                createdAt: new Date(),
                updatedAt: new Date(),
                isFavorite: true
            }
        ];
        this.docsSubject.next(mockDocs);
    }

    getDoc(id: string): Observable<Doc | undefined> {
        // Simple recursive search for mock data
        const findDoc = (docs: Doc[], id: string): Doc | undefined => {
            for (const doc of docs) {
                if (doc.id === id) return doc;
                if (doc.children) {
                    const found = findDoc(doc.children, id);
                    if (found) return found;
                }
            }
            return undefined;
        };
        return of(findDoc(this.docsSubject.value, id));
    }

    createDoc(doc: Partial<Doc>): Observable<Doc> {
        const newDoc: Doc = {
            id: Math.random().toString(36).substr(2, 9),
            title: doc.title || 'Untitled',
            createdAt: new Date(),
            updatedAt: new Date(),
            ...doc
        };
        const currentDocs = this.docsSubject.value;
        this.docsSubject.next([...currentDocs, newDoc]);
        return of(newDoc);
    }

    updateDoc(id: string, changes: Partial<Doc>): Observable<Doc | undefined> {
        // This is a simplified update for mock data. 
        // In a real app, we'd update the specific doc in the tree.
        // For now, let's just update if it's top level or re-fetch.
        // Implementing full tree update is complex for mock.
        return of(undefined);
    }
}

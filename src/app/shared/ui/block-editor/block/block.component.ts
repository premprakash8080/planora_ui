import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Block, BlockType } from '../models/block.model';

@Component({
    selector: 'app-block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements AfterViewInit, OnChanges {
    @Input() block!: Block;
    @Input() selected = false;
    @Output() update = new EventEmitter<string>();
    @Output() enter = new EventEmitter<void>();
    @Output() backspace = new EventEmitter<void>();
    @Output() slash = new EventEmitter<{ x: number, y: number, blockId: string }>();
    @Output() navigate = new EventEmitter<'up' | 'down' | 'select-up' | 'select-down'>();

    @ViewChild('editable', { static: false }) editable!: ElementRef;

    constructor() { }

    ngAfterViewInit(): void {
        if (this.editable && this.block.content) {
            this.editable.nativeElement.innerText = this.block.content;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['block'] && !changes['block'].firstChange) {
            // Only update content if it's different to avoid cursor jumping
            // This is a simplified check, might need more robust cursor management
            if (this.editable && this.editable.nativeElement.innerText !== this.block.content) {
                this.editable.nativeElement.innerText = this.block.content;
            }
        }
    }

    onInput(event: Event): void {
        const text = (event.target as HTMLElement).innerText;
        this.update.emit(text);

        // Check for slash command
        // Trigger if text ends with '/' or if the cursor is right after '/'
        // We'll use a simplified check for now: if the last typed char was '/'
        // Ideally we check selection range.
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const startOffset = range.startOffset;
            // Check if the character before cursor is '/'
            // Note: innerText might have different offsets than textContent depending on browser
            // For contenteditable, accessing the text node directly is safer.
            const textNode = range.startContainer;
            if (textNode.nodeType === Node.TEXT_NODE) {
                const content = textNode.textContent || '';
                if (content[startOffset - 1] === '/') {
                    const rect = range.getBoundingClientRect();
                    this.slash.emit({ x: rect.left, y: rect.bottom + 5, blockId: this.block.id });
                    return;
                }
            }
        }
    }

    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.enter.emit();
        } else if (event.key === 'Backspace' && (event.target as HTMLElement).innerText === '') {
            event.preventDefault();
            this.backspace.emit();
        } else if (event.key === 'ArrowUp') {
            if (event.shiftKey) {
                event.preventDefault();
                this.navigate.emit('select-up');
                return;
            }
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (range.startOffset === 0 && range.endOffset === 0) {
                    event.preventDefault();
                    this.navigate.emit('up');
                } else {
                    if (range.startOffset === 0) {
                        event.preventDefault();
                        this.navigate.emit('up');
                    }
                }
            }
        } else if (event.key === 'ArrowDown') {
            if (event.shiftKey) {
                event.preventDefault();
                this.navigate.emit('select-down');
                return;
            }
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const textLength = (event.target as HTMLElement).innerText.length;
                if (range.startOffset === textLength) {
                    event.preventDefault();
                    this.navigate.emit('down');
                }
            }
        }
    }
    onFocus(): void {
        // Handle focus event if needed
    }

    onBlur(): void {
        // Handle blur event if needed
    }

    getPlaceholder(): string {
        if (this.block.type === 'paragraph' && !this.block.content) {
            return "Type '/' for commands";
        }
        if (this.block.type === 'heading1' && !this.block.content) {
            return 'Heading 1';
        }
        if (this.block.type === 'heading2' && !this.block.content) {
            return 'Heading 2';
        }
        if (this.block.type === 'heading3' && !this.block.content) {
            return 'Heading 3';
        }
        if (this.block.type === 'quote' && !this.block.content) {
            return 'Empty quote';
        }
        if (this.block.type === 'code' && !this.block.content) {
            return 'Code block';
        }
        return '';
    }
}

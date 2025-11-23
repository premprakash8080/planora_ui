import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Block, BlockType } from './models/block.model';
import { v4 as uuidv4 } from 'uuid';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockEditorComponent implements OnInit {
    @Input() initialData: Block[] = [];
    @Output() change = new EventEmitter<Block[]>();

    blocks: Block[] = [];

    // Slash menu state
    showSlashMenu = false;
    slashMenuPosition = { x: 0, y: 0 };
    slashMenuFilter = '';
    activeBlockId: string | null = null;
    selectedBlockIds: Set<string> = new Set();

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        if (this.initialData && this.initialData.length > 0) {
            this.blocks = JSON.parse(JSON.stringify(this.initialData));
        } else {
            // Start with one empty paragraph
            this.addBlock('paragraph');
        }

        // Ensure at least one block exists
        if (this.blocks.length === 0) {
            this.addBlock('paragraph');
        }
    }

    addBlock(type: BlockType = 'paragraph', afterBlockId?: string): Block {
        const newBlock: Block = {
            id: uuidv4(),
            type,
            content: ''
        };

        if (afterBlockId) {
            const index = this.blocks.findIndex(b => b.id === afterBlockId);
            if (index !== -1) {
                this.blocks.splice(index + 1, 0, newBlock);
            } else {
                this.blocks.push(newBlock);
            }
        } else {
            this.blocks.push(newBlock);
        }

        this.emitChange();
        return newBlock;
    }

    updateBlock(id: string, content: string): void {
        const block = this.blocks.find(b => b.id === id);
        if (block) {
            block.content = content;
            this.emitChange();
        }
    }

    deleteBlock(id: string): void {
        const index = this.blocks.findIndex(b => b.id === id);
        if (index !== -1) {
            this.blocks.splice(index, 1);
            this.emitChange();
        }
    }

    onBlockEnter(blockId: string): void {
        const newBlock = this.addBlock('paragraph', blockId);
        this.focusBlock(newBlock.id, 'start');
    }

    onBlockBackspace(blockId: string): void {
        const index = this.blocks.findIndex(b => b.id === blockId);
        if (index > 0) {
            const currentBlock = this.blocks[index];
            const prevBlock = this.blocks[index - 1];

            // If current block is empty, delete it and focus previous
            if (!currentBlock.content) {
                this.deleteBlock(blockId);
                this.focusBlock(prevBlock.id, 'end');
            } else {
                // Advanced: If at start of block, merge with previous?
                // For now, only delete if empty as per requirements "If block is empty -> delete block"
                // "If block has content -> normal delete text" (handled by contenteditable)
            }
        }
    }

    onBlockNavigate(blockId: string, direction: 'up' | 'down' | 'select-up' | 'select-down'): void {
        const index = this.blocks.findIndex(b => b.id === blockId);

        if (direction === 'up' && index > 0) {
            this.focusBlock(this.blocks[index - 1].id, 'end');
        } else if (direction === 'down' && index < this.blocks.length - 1) {
            this.focusBlock(this.blocks[index + 1].id, 'start');
        } else if (direction === 'select-up') {
            // Add current and previous to selection
            this.selectedBlockIds.add(blockId);
            if (index > 0) {
                this.selectedBlockIds.add(this.blocks[index - 1].id);
                this.focusBlock(this.blocks[index - 1].id, 'end');
            }
        } else if (direction === 'select-down') {
            // Add current and next to selection
            this.selectedBlockIds.add(blockId);
            if (index < this.blocks.length - 1) {
                this.selectedBlockIds.add(this.blocks[index + 1].id);
                this.focusBlock(this.blocks[index + 1].id, 'start');
            }
        }
    }

    focusBlock(blockId: string, position: 'start' | 'end' = 'end'): void {
        // Use requestAnimationFrame for better timing with DOM updates
        requestAnimationFrame(() => {
            const element = document.getElementById(`block-${blockId}`);
            if (element) {
                const editable = element.querySelector('[contenteditable]');
                if (editable) {
                    (editable as HTMLElement).focus();
                    const range = document.createRange();
                    const sel = window.getSelection();

                    // Ensure we have a text node to select if possible, otherwise select contents
                    // This helps with "start" vs "end" in empty blocks
                    range.selectNodeContents(editable as Node);
                    range.collapse(position === 'start');

                    sel?.removeAllRanges();
                    sel?.addRange(range);
                }
            }
        });
    }

    onSlashMenuTrigger(event: { x: number, y: number, blockId: string }): void {
        this.showSlashMenu = true;
        this.slashMenuPosition = { x: event.x, y: event.y };
        this.activeBlockId = event.blockId;
        this.slashMenuFilter = '';
    }

    onSlashMenuSelect(type: BlockType): void {
        if (this.activeBlockId) {
            const block = this.blocks.find(b => b.id === this.activeBlockId);
            if (block) {
                // Remove the '/' character
                // We assume the slash is at the end or we just remove the last '/' found?
                // Or simpler: if the block content is just '/', clear it.
                // If it has text like "hello /", remove the slash.
                // Since we trigger on '/', let's assume we want to remove the slash that triggered it.
                // For MVP, let's just remove the last character if it is a slash, or replace content if it was only '/'.

                let newContent = block.content;
                if (newContent.endsWith('/')) {
                    newContent = newContent.slice(0, -1);
                } else {
                    // If the slash was in the middle, it's harder to find without passing the exact position.
                    // But usually slash command is at the end of typing.
                    // Let's try to remove the last occurrence of '/'
                    const lastSlashIndex = newContent.lastIndexOf('/');
                    if (lastSlashIndex !== -1) {
                        newContent = newContent.substring(0, lastSlashIndex) + newContent.substring(lastSlashIndex + 1);
                    }
                }

                block.type = type;
                block.content = newContent;

                this.emitChange();

                // Restore focus to the block
                this.focusBlock(block.id, 'end');
            }
        }
        this.closeSlashMenu();
    }

    closeSlashMenu(): void {
        this.showSlashMenu = false;
        this.activeBlockId = null;
    }

    private emitChange(): void {
        this.change.emit(this.blocks);
        this.cdr.markForCheck(); // Ensure UI updates
    }

    trackByFn(index: number, item: Block): string {
        return item.id;
    }

    drop(event: CdkDragDrop<Block[]>) {
        moveItemInArray(this.blocks, event.previousIndex, event.currentIndex);
        this.emitChange();
    }

    isBlockSelected(blockId: string): boolean {
        return this.selectedBlockIds.has(blockId);
    }

    // TODO: Add methods to handle Shift+Arrow selection expansion
    // For now, we'll stick to basic drag and drop reordering
    // Focus the last block if clicked in the empty space of the editor
    onContainerClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            const lastBlock = this.blocks[this.blocks.length - 1];
            if (lastBlock) {
                this.focusBlock(lastBlock.id, 'end');
            }
        }
    }
}

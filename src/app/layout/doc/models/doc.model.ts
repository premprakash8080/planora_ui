import { Block } from '../../../shared/ui/block-editor/models/block.model';

export interface Doc {
    id: string;
    title: string;
    content?: string;
    blocks?: Block[]; // For block-based editor
    icon?: string;
    coverImage?: string;
    createdAt: Date;
    updatedAt: Date;
    parentId?: string; // For nested pages
    children?: Doc[]; // For tree view
    isFavorite?: boolean;
}

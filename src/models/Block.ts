import { IDoc } from "./DB";
export interface IBlock extends IDoc {
    title: string;
    type: 'text' | 'file';
    data: string;  // Assuming data is a string for simplicity
}

export interface Block {
    title: string;
    type: 'text' | 'file';
    data: string;  // Assuming data is a string for simplicity
}

export type BlockDoc = Block & IDoc;
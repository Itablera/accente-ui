// models/Block.ts
export interface IBlock {
    id: string;
    title: string;
    type: 'text' | 'file';
    data: string;  // Assuming data is a string for simplicity
}

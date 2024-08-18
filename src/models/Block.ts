import { IDoc } from "./DB";

export interface IBlock {
    path: string;
    type: 'text' | 'file';
    data: string;  // Assuming data is a string for simplicity
}

export type IBlockDoc = IBlock & IDoc;
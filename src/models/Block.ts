import { IDoc } from "./";

export interface IBlock {
    title: string;
    type: 'text' | 'file';
    data: string;  // Assuming data is a string for simplicity
}

export type IBlockDoc = IBlock & IDoc;
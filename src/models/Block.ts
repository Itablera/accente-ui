import { IDoc } from "./DB";
export interface IBlock extends IDoc {
    title: string;
    type: 'text' | 'file';
    data: string;  // Assuming data is a string for simplicity
}

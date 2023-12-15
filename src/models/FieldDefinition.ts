import { IDoc } from "./DB";

export interface IFieldDefinition extends IDoc {
    name: string;
    ValueType: 'block' | 'text' | 'date'
}

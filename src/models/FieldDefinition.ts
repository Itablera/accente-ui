import { IDoc } from "./DB";

export interface IFieldDefinition {
    name: string;
    ValueType: 'block' | 'text' | 'date'
}

export type IFieldDefinitionDoc = IFieldDefinition & IDoc;

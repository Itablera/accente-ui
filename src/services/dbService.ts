import PouchDB from 'pouchdb';
import { IFieldDefinitionDoc, IBlockDoc } from '../models';

type CollectionType = 'blocks' | 'fieldDefinitions' | 'fields';
const blocksDB = new PouchDB('blocks');
const fieldDefinitionsDB = new PouchDB('fieldDefinitions');
const fieldsDB = new PouchDB('fields');
const emptyDB = new PouchDB('empty');

const getDB = ( collection: CollectionType ) => ( collection === 'blocks' && blocksDB ) || ( collection === 'fieldDefinitions' && fieldDefinitionsDB ) || ( collection === 'fields' && fieldsDB ) || emptyDB;

export const fetch = async <T>(collection: CollectionType): Promise<T[]> => {
    const db = getDB(collection);
    const allBlocks = await db.allDocs({ include_docs: true });
    return allBlocks.rows.map(row => {return { ...row.doc, id: row.id }}) as unknown as T[];
};

export const fetchSingle = async <T>(collection: CollectionType, id: string): Promise<T> => {
    const db = getDB(collection);
    const block = await db.get(id);
    return block as unknown as T;
};

export const create = async <T>(collection: CollectionType, newData: Partial<T>): Promise<T> => {
    const db = getDB(collection);
    const addResult = await db.post(newData);
    return addResult as unknown as T;
};

export const update = async <T extends IFieldDefinitionDoc | IBlockDoc>(collection: CollectionType, id: string, updatedData: Partial<T>): Promise<T> => {
    const db = getDB(collection);
    const { _id: userProvidedId, _rev: userProvidedRev, ...properties } = updatedData;
    try {
        const doc = await db.get(id);
        const updatedDoc = {
            ...doc,
            ...properties,
        }
        const updateResult = await db.put(updatedDoc);
    
        return { ...updatedDoc, _rev: updateResult.rev } as unknown as T;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};

export const remove = async (collection: CollectionType, id: string): Promise<void> => {
    const db = getDB(collection);
    const doc = await db.get(id);
    const updateResult = await db.remove(doc);
};
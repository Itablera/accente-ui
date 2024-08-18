import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import { IBlockDoc } from '../models/Block';
import { IFieldDefinitionDoc } from '../models/FieldDefinition';

PouchDB.plugin(PouchDBFind);

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

export const fetchSingle = async <T>(collection: CollectionType, path: string): Promise<T | null> => {
    const db = getDB(collection);
    const { docs: [ doc = null ] = [] } = await db.find({ selector: { path } });
    return doc as unknown as T;
};

export const create = async <T>(collection: CollectionType, newData: Partial<T>): Promise<T> => {
    const db = getDB(collection);
    const addResult = await db.post(newData);
    return { ...newData, _id: addResult.id, _rev: addResult.rev } as unknown as T;
};

export const update = async <T extends IFieldDefinitionDoc | IBlockDoc>(collection: CollectionType, path: string, updatedData: Partial<T>): Promise<T> => {
    const db = getDB(collection);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: userProvidedId, _rev: userProvidedRev, ...properties } = updatedData;
    try {
        const { docs: [ doc ] } = await db.find({ selector: { path } });
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

export const remove = async (collection: CollectionType, path: string): Promise<void> => {
    const db = getDB(collection);
    const { docs: [ doc ] } = await db.find({ selector: { path } });
    await db.remove(doc);
};
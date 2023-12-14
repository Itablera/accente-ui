// services/BlockService.ts
import PouchDB from 'pouchdb';
import { IBlock } from '../models/Block';

const db = new PouchDB('blocks');

export const BlockService = {
    getAllBlocks: async (): Promise<IBlock[]> => {
        const allBlocks = await db.allDocs({ include_docs: true });
        return allBlocks.rows.map(row => {return { ...row.doc, id: row.id }}) as unknown as IBlock[];
    },
    getBlockById: async (id: string): Promise<IBlock> => {
            const block = await db.get(id);
            return block as unknown as IBlock;
    },
    addBlock: async (newBlock: IBlock): Promise<void> => {
        const addResult = await db.post(newBlock);
        console.log(addResult);
    },
    updateBlock: async (id: string, updatedBlock: IBlock): Promise<void> => {
        const updateResult = await db.put({
            _id: id,
            ...updatedBlock,
        });

        console.log(updateResult);
    },
    // More CRUD operations...
};
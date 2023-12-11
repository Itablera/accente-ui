// services/BlockService.ts
import PouchDB from 'pouchdb';
import { IBlock } from '../models/Block';

const db = new PouchDB('blocks');

export const BlockService = {
    getAllBlocks: async (): Promise<IBlock[]> => {
        const allBlocks = await db.allDocs({ include_docs: true });
        return allBlocks.rows.map(row => row.doc) as unknown as IBlock[];
    },
    getBlockById: async (id: string): Promise<IBlock> => {
        return await db.get(id) as IBlock;
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

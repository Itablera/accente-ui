// services/BlockService.ts
import PouchDB from 'pouchdb';
import { IBlock } from '../models/Block';
import { useState, useEffect } from 'react';
import { UseMutationOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
    updateBlock: async (id: string, updatedBlock: Partial<IBlock>): Promise<void> => {
        const updateResult = await db.put({
            _id: id,
            ...updatedBlock,
        });

        console.log(updateResult);
    },
    deleteBlock: async (id: string): Promise<void> => {
        const doc = await db.get(id);
        const updateResult = await db.remove(doc);

        console.log(updateResult);
    },
};

export const useBlockService = ( options: UseMutationOptions = {} ) => {
    const queryClient = useQueryClient();

    const id = 'some-id';
    const block: IBlock = { _id: 'some-id', title: 'Some Title', type: 'text', data: 'Some Data' };

    // Fetch Data
    const { data, isLoading, error } = useQuery({ 
        queryKey: [ 'block', id ] , 
        queryFn: () => BlockService.getBlockById 
    });

    // Create Data
    const createMutation = useMutation({
        mutationKey: [ 'block', block ],
        mutationFn: () => BlockService.addBlock(block),
        ...options
    });

    // Update Data
    const updateMutation = useMutation({
        mutationKey: [ 'block', block ],
        mutationFn: () => BlockService.updateBlock(id, block),
        ...options
    });

    // Delete Data
    const deleteMutation = useMutation({
        mutationKey: [ 'block', block ],
        mutationFn: () => BlockService.deleteBlock(id),
        ...options
    });

    return { data, isLoading, error, createMutation, updateMutation, deleteMutation };
}

export const useGetBlock = ( id: string, options: UseMutationOptions = {} ) => useQuery({ 
    queryKey: [ 'block', id ] , 
    queryFn: () => BlockService.getBlockById 
});

export const useCreateBlock = ( block: IBlock, options: UseMutationOptions = {} ) => useMutation({
    ...options,
    mutationKey: [ 'block', block ],
    mutationFn: () => BlockService.addBlock(block)
});

export const useUpdateBlock = ( id: string, block: Partial<IBlock>, options: UseMutationOptions = {} ) => useMutation({
    ...options,
    mutationKey: [ 'block', block ],
    mutationFn: () => BlockService.updateBlock(id, block)
});
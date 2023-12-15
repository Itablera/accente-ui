import PouchDB from 'pouchdb';
import { useQuery, useMutation, useQueryClient, MutationOptions, UseMutateFunction } from '@tanstack/react-query';
import { IFieldDefinition, IBlock } from '../models';

type CollectionType = 'blocks' | 'fieldDefinitions' | 'fields';
const blocksDB = new PouchDB('blocks');
const fieldDefinitionsDB = new PouchDB('fieldDefinitions');
const fieldsDB = new PouchDB('fields');
const emptyDB = new PouchDB('empty');

const getDB = ( collection: CollectionType ) => ( collection === 'blocks' && blocksDB ) || ( collection === 'fieldDefinitions' && fieldDefinitionsDB ) || ( collection === 'fields' && fieldsDB ) || emptyDB;

const fetchData = async <T>(collection: CollectionType): Promise<T[]> => {
    const db = getDB(collection);
    const allBlocks = await db.allDocs({ include_docs: true });
    return allBlocks.rows.map(row => {return { ...row.doc, id: row.id }}) as unknown as T[];
};

const fetchSingle = async <T>(collection: CollectionType, id: string): Promise<T> => {
    const db = getDB(collection);
    const block = await db.get(id);
    return block as unknown as T;
};

const createData = async <T>(collection: CollectionType, newData: Partial<T>): Promise<T> => {
    const db = getDB(collection);
    const addResult = await db.post(newData);
    return addResult as unknown as T;
};

const updateData = async <T extends IFieldDefinition | IBlock>(collection: CollectionType, id: string, updatedData: Partial<T>): Promise<T> => {
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

const deleteData = async (collection: CollectionType, id: string): Promise<void> => {
    const db = getDB(collection);
    const doc = await db.get(id);
    const updateResult = await db.remove(doc);
};

export type UseDataService<T> = () => {
    data: T | undefined;
    error: unknown;
    setData: UseMutateFunction<T, unknown, {
        data: Partial<T>;
        options?: MutationOptions<unknown, Error, void, unknown> | undefined;
    }, unknown>
}

export const useDataService = <T extends IFieldDefinition | IBlock >(collection: CollectionType) => {
    const queryClient = useQueryClient();

    // Fetch Data
    const { data: list, isLoading, error } = useQuery<T[], unknown>({ queryKey: [collection], queryFn: () => fetchData<T>(collection)});

    // Fetch single
    const useGetBlock = ( id: string ) => useQuery<T, unknown>({ queryKey: [collection, id], queryFn: () => fetchSingle<T>(collection, id)});


    // Create Data
    const createMutation = useMutation<T, unknown, { data: Partial<T>, options?: MutationOptions }>({
        mutationFn: ({ data: newData}) => createData<T>(collection, newData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [collection]}),
    });
    const useCreateMutation: UseDataService<T>  = () => { 
        return { data: createMutation.data, error: createMutation.error, setData: createMutation.mutate };
    };

    // Update Data
    const updateMutation = useMutation<T, unknown, { data: Partial<T>, options?: MutationOptions }>({
        mutationFn: ({ data: newData}) => updateData<T>(collection, newData._id = '', newData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [collection]}),
    });
    const useUpdateMutation: UseDataService<T> = () => { 
        return { data: updateMutation.data, error: updateMutation.error, setData: updateMutation.mutate };
    };

    // Delete Data
    const deleteMutation = useMutation<void, unknown, string>({
        mutationFn: (id) => deleteData(collection, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [collection]}),
    });

    return { list, isLoading, error, createMutation, updateMutation, deleteMutation, useGetBlock, useCreateMutation, useUpdateMutation };
};

export const useBlockDBService = () => useDataService<IBlock>('blocks');

export type BlockStorage = {
    data: IBlock | undefined;
    setData: UseMutateFunction<IBlock, unknown, {
        data: Partial<IBlock>;
        options?: MutationOptions<unknown, Error, void, unknown> | undefined;
    }, unknown>;
    isLoading: boolean;
    isFetching: boolean;
}
export type UseBlockStorage = (id: string, defaultValue?: IBlock) => BlockStorage;

export const useBlockStorage: UseBlockStorage = (id: string) => {
    const queryClient = useQueryClient();
  
    // Fetching data from localStorage
    const { data, isLoading, isFetching } = useQuery<IBlock, unknown>({
        queryKey: ['blocks', id],
        queryFn: () => fetchSingle('blocks', id),
        staleTime: Infinity,
    });
  
    // Update localStorage
    const { mutate: setData } = useMutation<IBlock, unknown, { data: Partial<IBlock>, options?: MutationOptions }>({
        mutationFn: ({ data }) => updateData<IBlock>('blocks', id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blocks', id]}),
    });
  
    return {data, setData, isLoading, isFetching};
};
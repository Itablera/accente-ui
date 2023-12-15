import PouchDB from 'pouchdb';
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult, MutationOptions } from '@tanstack/react-query';
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

const createData = async <T>(collection: CollectionType, newData: Omit<Partial<T>, '_id' | '_rev'>): Promise<T> => {
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

export const useDataService = <T extends IFieldDefinition | IBlock >(collection: CollectionType): {
  data: T[]| undefined;
  isLoading: boolean;
  error: unknown;
  createMutation: UseMutationResult<Omit<Partial<T>, '_id' | '_rev'>, unknown, Omit<Partial<T>, '_id' | '_rev'>>;
  updateMutation: UseMutationResult<T, unknown, { id: string, data: Partial<T>, options?: MutationOptions }, unknown>;
  deleteMutation: UseMutationResult<void, unknown, string, unknown>;
  useGetBlock: ( id: string ) => UseQueryResult<T, unknown>;
} => {
  const queryClient = useQueryClient();

  // Fetch Data
  const { data, isLoading, error } = useQuery<T[], unknown>({ queryKey: [collection], queryFn: () => fetchData<T>(collection)});

  // Fetch single
  const useGetBlock = ( id: string ) => useQuery<T, unknown>({ queryKey: [collection, id], queryFn: () => fetchSingle<T>(collection, id)});


  // Create Data
  const createMutation = useMutation<Omit<Partial<T>, '_id' | '_rev'>, unknown, Omit<Partial<T>, '_id' | '_rev'>>({
    mutationFn: (newData) => createData<T>(collection, newData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [collection]}),
  });

  // Update Data
  const updateMutation = useMutation<T, { id: string, options: {} }, { id: string, data: Partial<T>, options?: MutationOptions }>({
    mutationFn: ({ id, data: newData}) => updateData<T>(collection, id, newData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [collection]}),
  });

  // Delete Data
  const deleteMutation = useMutation<void, unknown, string>({
    mutationFn: (id) => deleteData(collection, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [collection]}),
  });

  return { data, isLoading, error, createMutation, updateMutation, deleteMutation, useGetBlock };
};

export const useBlockDBService = () => useDataService<IBlock>('blocks');
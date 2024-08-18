import { useQuery, useMutation, useQueryClient, MutationOptions, UseMutateFunction } from '@tanstack/react-query';
import { IBlock, IBlockDoc } from '../models/Block';
import { fetchSingle, update } from '../services/dbService';


type UseBlockReturn = {
    block: IBlockDoc | undefined;
    setBlock: UseMutateFunction<IBlock, unknown, {
        data: Partial<IBlock>;
        options?: MutationOptions<unknown, Error, void, unknown> | undefined;
    }, unknown>;
    isLoading: boolean;
    isFetching: boolean;
};

type SourceFunctions = {
    queryFn: () => Promise<IBlockDoc>;
    mutationFn: ({ data }: { data: Partial<IBlockDoc> }) => Promise<IBlock>;
};
const getSourceFunctions = (source: string, path: string): SourceFunctions => {
    switch (source) {
        case 'browser':
            return {
                queryFn: () => fetchSingle('blocks', path),
                mutationFn: ({ data }) => update<IBlockDoc>('blocks', path, data),
            };
        default:
            throw new Error('Invalid source');
    }
}

type UseBlock = (source: string, path: string, defaultValue?: IBlock) => UseBlockReturn;
export const useBlock: UseBlock = (source: string = 'local', path: string) => {
    const queryClient = useQueryClient();
    const { queryFn, mutationFn } = getSourceFunctions(source, path);

    // Fetching data from localStorage
    const { data: block, isLoading, isFetching } = useQuery<IBlockDoc, unknown>({
        queryKey: ['blocks', path],
        queryFn,
        staleTime: Infinity,
    });

    // Update localStorage
    const { mutate: setBlock } = useMutation<IBlock, unknown, { data: Partial<IBlockDoc>; options?: MutationOptions; }>({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blocks', path] }),
    });

    return { block, setBlock, isLoading, isFetching };
};

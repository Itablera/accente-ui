import { useQuery, useMutation, useQueryClient, MutationOptions, UseMutateFunction } from '@tanstack/react-query';
import { IBlock, IBlockDoc } from '../models/Block';
import { create, fetch } from '../services/dbService';


type Blocks = {
    blocks: IBlockDoc[] | undefined;
    addBlock: UseMutateFunction<IBlock, unknown, {
        data: Partial<IBlock>;
        options?: MutationOptions<unknown, Error, void, unknown> | undefined;
    }, unknown>;
    isLoading: boolean;
    isFetching: boolean;
};

type SourceFunctions = {
    queryFn: () => Promise<IBlockDoc[]>;
    mutationFn: ({ data }: { data: Partial<IBlockDoc> }) => Promise<IBlock>;
};
const getSourceFunctions = (source: string): SourceFunctions => {
    switch (source) {
        case 'browser':
            return {
                queryFn: () => fetch<IBlockDoc>('blocks'),
                mutationFn: ({ data }: { data: Partial<IBlockDoc> }) => create<IBlockDoc>('blocks', data),
            };
        default:
            throw new Error('Invalid source');
    }
}

type UseSource = (source?: string) => Blocks;
export const useSource: UseSource = (source = 'browser') => {
    const queryClient = useQueryClient();
    const { queryFn, mutationFn } = getSourceFunctions(source);

    // Fetching data from localStorage
    const { data: blocks, isLoading, isFetching } = useQuery<IBlockDoc[], unknown>({
        queryKey: ['blocks'],
        queryFn,
        staleTime: Infinity,
    });

    // Update localStorage
    const { mutate: addBlock } = useMutation<IBlock, unknown, { data: Partial<IBlock>; options?: MutationOptions; }>({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blocks'] }),
    });

    return { blocks, addBlock, isLoading, isFetching };
};

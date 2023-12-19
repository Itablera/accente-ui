import { useQuery, useMutation, useQueryClient, MutationOptions, UseMutateFunction } from '@tanstack/react-query';
import { IBlock, IBlockDoc } from '../models';
import { create, fetch } from '../services';


type Blocks = {
    blocks: IBlockDoc[] | undefined;
    addBlock: UseMutateFunction<IBlock, unknown, {
        data: Partial<IBlock>;
        options?: MutationOptions<unknown, Error, void, unknown> | undefined;
    }, unknown>;
    isLoading: boolean;
    isFetching: boolean;
};
type UseBlocks = (defaultValue?: IBlock) => Blocks;

export const useBlocks: UseBlocks = () => {
    const queryClient = useQueryClient();

    // Fetching data from localStorage
    const { data: blocks, isLoading, isFetching } = useQuery<IBlockDoc[], unknown>({
        queryKey: ['blocks'],
        queryFn: () => fetch('blocks'),
        staleTime: Infinity,
    });

    // Update localStorage
    const { mutate: addBlock } = useMutation<IBlock, unknown, { data: Partial<IBlock>; options?: MutationOptions; }>({
        mutationFn: ({ data }) => create<IBlockDoc>('blocks', data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blocks'] }),
    });

    return { blocks, addBlock, isLoading, isFetching };
};

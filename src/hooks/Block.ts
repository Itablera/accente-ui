import { useQuery, useMutation, useQueryClient, MutationOptions, UseMutateFunction } from '@tanstack/react-query';
import { IBlock, IBlockDoc } from '../models';
import { fetchSingle, update } from '../services';


type UseBlockReturn = {
    block: IBlockDoc | undefined;
    setBlock: UseMutateFunction<IBlock, unknown, {
        data: Partial<IBlock>;
        options?: MutationOptions<unknown, Error, void, unknown> | undefined;
    }, unknown>;
    isLoading: boolean;
    isFetching: boolean;
};
type UseBlock = (id: string, defaultValue?: IBlock) => UseBlockReturn;

export const useBlock: UseBlock = (id: string) => {
    const queryClient = useQueryClient();

    // Fetching data from localStorage
    const { data: block, isLoading, isFetching } = useQuery<IBlockDoc, unknown>({
        queryKey: ['blocks', id],
        queryFn: () => fetchSingle('blocks', id),
        staleTime: Infinity,
    });

    // Update localStorage
    const { mutate: setBlock } = useMutation<IBlock, unknown, { data: Partial<IBlockDoc>; options?: MutationOptions; }>({
        mutationFn: ({ data }) => update<IBlockDoc>('blocks', id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blocks', id] }),
    });

    return { block, setBlock, isLoading, isFetching };
};

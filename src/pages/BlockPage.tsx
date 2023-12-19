// BlockPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useBlock } from '../hooks';
import { Block } from '../components';

export const BlockPage: React.FC = () => {
    const { id = '' } = useParams<{ id: string }>();
    const { block, isFetching, isLoading } = useBlock(id);

    if (!block || isLoading || isFetching) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <h1>Block Page </h1>
            <Block block={block} />
        </div>
    );
};

export default BlockPage;

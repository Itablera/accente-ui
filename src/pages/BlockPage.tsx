// BlockPage.tsx
import React, {  } from 'react';
import { useParams } from 'react-router-dom';
import Block from '../components/Block';
import { useBlockStorage } from '../services/DBService';

const BlockPage: React.FC = () => {
    const { id = '' } = useParams<{ id: string }>();

    const useBlock = useBlockStorage(id);
    const { block, isFetching, isLoading } = useBlock;

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

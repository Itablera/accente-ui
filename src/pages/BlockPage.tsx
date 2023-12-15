// BlockPage.tsx
import React, {  } from 'react';
import { useParams } from 'react-router-dom';
import Block from '../components/Block';
import { useBlockDBService } from '../services/DBService';

const BlockPage: React.FC = () => {
    const { id = '' } = useParams<{ id: string }>();

    const { useGetBlock } = useBlockDBService();
    const { data: block } = useGetBlock(id);
    
    return (
        <div>
            <h1>Block Page</h1>
            <Block block={block} />
        </div>
    );
};

export default BlockPage;

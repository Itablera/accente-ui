// BlockPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useBlock } from '../hooks/Block';
import { Block } from '../components/Block';

export const BlockPage: React.FC = () => {
    const { '*': path = '' } = useParams<{ '*': string }>();
    const { block, isFetching, isLoading } = useBlock('browser', path);

    if (isLoading || isFetching) {
        return <div>Loading...</div>;
    }
    if (!block) {
        return <div>Block not found</div>;
    }
    
    return (
        <div className="dark-theme dark-editor prose prose-invert">
            <Block block={block} />
        </div>
    );
};

export default BlockPage;

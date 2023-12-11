// BlockPage.tsx
import React, { useEffect, useState } from 'react';
import Block from '../components/Block';
import { IBlock } from '../models/Block';
import { BlockService } from '../services/BlockService';

const BlockPage: React.FC = () => {
    const [block, setBlock] = useState<IBlock | null>(null);

    useEffect(() => {
        // Assume we're getting the block ID from route params or similar
        const blockId = 'some-block-id';
        BlockService.getBlockById(blockId).then(setBlock);
    }, []);

    if (!block) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Block Page</h1>
            <Block block={block} />
        </div>
    );
};

export default BlockPage;

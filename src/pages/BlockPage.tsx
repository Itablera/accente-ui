// BlockPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Block from '../components/Block';
import { IBlock } from '../models/Block';
import { BlockService } from '../services/BlockService';

const BlockPage: React.FC = () => {
    const [block, setBlock] = useState<IBlock | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            BlockService
                .getBlockById(id)
                .then(setBlock)
                .catch(() => setBlock({ id: 'error', title: 'No Block found', data: '', type: 'text' }));
        }
    }, [id]);

    if (id && !block) {
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

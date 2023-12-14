// pages/ListBlocksPage.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IBlock } from '../models/Block';
import { BlockService } from '../services/BlockService';

const ListBlocksPage: React.FC = () => {
    const [blocks, setBlocks] = useState<IBlock[] | null>(null);

    useEffect(() => {
        if (true) {
            BlockService.getAllBlocks().then(setBlocks);
        }
    }, []);

    if (!blocks) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>List of Blocks</h1>
            <ul>
                {blocks.map((block) => (
                    <li key={block.id}>
                        <Link to={`/block/${block.id}`}>{block.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListBlocksPage;

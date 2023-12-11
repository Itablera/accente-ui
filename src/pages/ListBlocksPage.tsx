// pages/ListBlocksPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { IBlock } from '../models/Block';

const ListBlocksPage: React.FC = () => {
    // Sample list of blocks (replace with actual data fetching logic)
    const blocks: IBlock[] = [];

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

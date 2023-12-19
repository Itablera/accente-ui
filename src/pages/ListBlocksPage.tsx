// pages/ListBlocksPage.tsx
import React, {  } from 'react';
import { Link } from 'react-router-dom';
import { useBlock } from '../hooks/Block';
import { useBlocks } from '../hooks/Blocks';

const ListBlocksPage: React.FC = () => {
    const { blocks } = useBlocks();

    if (!blocks) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>List of Blocks</h1>
            <ul>
                {blocks.map((block) => (
                    <li key={block._id}>
                        <Link to={`/block/${block._id}`}>{block.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListBlocksPage;

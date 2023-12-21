// pages/ListBlocksPage.tsx
import React, {  } from 'react';
import { Link } from 'react-router-dom';
import { useBlocks } from '../hooks/Blocks';

export const ListBlocksPage: React.FC = () => {
    const { blocks, addBlock } = useBlocks();

    if (!blocks) {
        return <div>Loading...</div>;
    }

    const handleAddBlock = () => {
        addBlock({ data: { title: 'New Block', data: '' } });
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
            <button onClick={handleAddBlock}>Add Block</button>
        </div>
    );
};

export default ListBlocksPage;
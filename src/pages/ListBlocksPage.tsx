// pages/ListBlocksPage.tsx
import React, {  } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSource } from '../hooks/Source';

export const SourcePage: React.FC = () => {
    const { sourceId = 'browser' } = useParams<{ sourceId: string }>();
    const { blocks, addBlock } = useSource(sourceId);

    if (!blocks) {
        return <div>Loading...</div>;
    }

    const handleAddBlock = () => {
        addBlock({ data: { path: 'New Block', data: '', type: 'text' } });
    }

    return (
        <div>
            <h1>List of Blocks</h1>
            <ul>
                {blocks.map((block) => (
                    <li key={block._id}>
                        <Link to={`/${sourceId}/${block.path}`}>{block.path}</Link>
                    </li>
                ))}
            </ul>
            <button onClick={handleAddBlock}>Add Block</button>
        </div>
    );
};

export default SourcePage;
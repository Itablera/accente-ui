// pages/ListBlocksPage.tsx
import React, {  } from 'react';
import { Link } from 'react-router-dom';
import { useBlockDBService } from '../services/DBService';

const ListBlocksPage: React.FC = () => {
    const { list: data } = useBlockDBService();

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>List of Blocks</h1>
            <ul>
                {data.map((block) => (
                    <li key={block._id}>
                        <Link to={`/block/${block._id}`}>{block.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListBlocksPage;

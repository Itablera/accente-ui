import React, { ChangeEvent, useState } from 'react';
import { IBlockDoc } from '../models/Block';
import { MDXEditor } from '@mdxeditor/editor';
import { useDebouncedFunction } from '../hooks/Debounce';
import { useBlock } from '../hooks/Block';


interface BlockProps {
    block: IBlockDoc;
}

export const Block: React.FC<BlockProps> = ({ block }) => {
    const [ title, setTitle ] = useState(block.title);
    const [ data, setData ] = useState(block.data);
    const { setBlock: setPersistedData } = useBlock(block._id);
    const debouncedAPICall = useDebouncedFunction(setPersistedData, 1000)
    const handleTitleChange = (change: ChangeEvent<HTMLInputElement>) => {
        setTitle(change.target.value);
        debouncedAPICall({data: { title: change.target.value }});
    }
    const handleDataChange = (change: string) => {
        setData(change);
        debouncedAPICall({data: { data: change }});
    }

      if (!block) {
          return <div>Loading...</div>;
      }

    return (
        <div>
            <input value={title} onChange={handleTitleChange} />
            <MDXEditor markdown={data} onChange={handleDataChange} />
        </div>
    );
};

export default Block;

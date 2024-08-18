import React, { ChangeEvent, useState } from 'react';
import { IBlockDoc } from '../models/Block';
import { useDebouncedFunction } from '../hooks/Debounce';
import { useBlock } from '../hooks/Block';
import ClickWrapper from '../pages/ClickWrapper';

interface BlockProps {
    block: IBlockDoc;
}

export const Block: React.FC<BlockProps> = ({ block }) => {
    const [ title, setTitle ] = useState(block.title);
    const [ data, setData ] = useState(block.data);
    const { setBlock: setPersistedData } = useBlock('browser', block.path);
    const debouncedAPICall = useDebouncedFunction(setPersistedData, 5000)
    const handleTitleChange = (change: string) => {
        const title = change;
        setTitle(title);
        debouncedAPICall({data: { title }});
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
            <h1><ClickWrapper inputValue={title} onChange={handleTitleChange} /></h1>
            <ClickWrapper 
              inputValue={data}
              onChange={handleDataChange} />
        </div>
    );
};

export default Block;

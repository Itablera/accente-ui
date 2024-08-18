import React, { useState } from 'react';
import { IBlockDoc } from '../models/Block';
import { useDebouncedFunction } from '../hooks/Debounce';
import { useBlock } from '../hooks/Block';
import ClickWrapper from '../pages/ClickWrapper';

interface BlockProps {
    block: IBlockDoc;
}

export const Block: React.FC<BlockProps> = ({ block }) => {
    const [ path, setPath ] = useState(block.path);
    const [ data, setData ] = useState(block.data);
    const { setBlock: setPersistedData } = useBlock('browser', block.path);
    const debouncedAPICall = useDebouncedFunction(setPersistedData, 5000)
    const handlePathChange = (change: string) => {
        const newPath = change;
        setPath(newPath);
        debouncedAPICall({data: { path: newPath }});
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
            <h1><ClickWrapper inputValue={path} onChange={handlePathChange} /></h1>
            <ClickWrapper 
              inputValue={data}
              onChange={handleDataChange} />
        </div>
    );
};

export default Block;

// Block.tsx
import React, { useState } from 'react';
import { IBlock } from '../models/Block';
import { MDXEditor, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, tablePlugin, thematicBreakPlugin } from '@mdxeditor/editor';
import { BlockStorage } from '../services/DBService';
import { useDebouncedValue, useDebouncedFunction } from '../services/Debounce';

export const ALL_PLUGINS = [
  //toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }), //Gets error about missing plugin or label viewMode
  listsPlugin(),
  quotePlugin(),
  headingsPlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin(),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
  codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
  diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
  markdownShortcutPlugin()
]

interface BlockProps {
    block: IBlock;
    useBlock: BlockStorage;
}

const Block: React.FC<BlockProps> = ({ block, useBlock }) => {
    const [data, setData] = useState<IBlock>(block);
    const debouncedData = useDebouncedValue<IBlock>(data, 1000)
    const { data: persistedData, setData: setPersistedData } = useBlock;
    const apiCall = (change: Partial<IBlock>) => setPersistedData({data: change});
    //const apiCall = () => console.log('api call');
    const debouncedAPICall = useDebouncedFunction(setPersistedData, 1000)
    const handleChange = (change: Partial<IBlock>) => {
        setData({ ...data, ...change })
        debouncedAPICall({data: change})
    }

      if (!data || !debouncedData) {
          return <div>Loading...</div>;
      }

    return (
        <div>

            <p>Value real-time: {data.title}</p>
            <p>Debounced value: {debouncedData.title}</p>
            <p>Persisted value: {persistedData?.title}</p>
            <input value={data.title} onChange={(e) => handleChange({ title: e.target.value })} />
            <MDXEditor markdown={data.data} onChange={(e) => handleChange({ data: e })} />
        </div>
    );
};

export default Block;

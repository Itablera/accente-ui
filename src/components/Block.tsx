// Block.tsx
import React, { ChangeEvent, useState } from 'react';
import { IBlock } from '../models/Block';
import { MDXEditor, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, tablePlugin, thematicBreakPlugin } from '@mdxeditor/editor';
import { useBlockStorage } from '../services/DBService';
import { useDebouncedFunction } from '../services/Debounce';

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
}

const Block: React.FC<BlockProps> = ({ block }) => {
    const [ title, setTitle ] = useState(block.title);
    const [ data, setData ] = useState(block.data);
    const { setBlock: setPersistedData } = useBlockStorage(block._id);
    const debouncedAPICall = useDebouncedFunction(setPersistedData, 500)
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

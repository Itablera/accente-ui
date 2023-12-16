// Block.tsx
import React, { useEffect, useState } from 'react';
import { IBlock } from '../models/Block';
import { BlockService } from '../services/BlockService';
import { KitchenSinkToolbar, MDXEditor, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor';
import { BlockStorage, UseBlockStorage, UseDataService, useBlockDBService } from '../services/DBService';
import { debounce } from 'lodash';

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
    const [ data, setData ] = useState<Partial<IBlock> | undefined>(block);
    const { data: persistedData, setData: setPersistedData } = useBlock;
    if (!data) {
        throw new Error('Data is undefined');
    }

    /*useEffect(() => {
        const handler = debounce(() => setPersistedData({data}), 500);
        handler();

        return () => handler.cancel();
    }, [data]);*/

    useDebouncedEffect(() => {
        if (data) {
            setPersistedData({data});
        }
    }
    , [data, persistedData], 1000);

    return (
        <div>
            <input type="text" value={data?.title || ''} onChange={(e) => setData({ title: e.target.value })} />
            <MDXEditor markdown={data?.data || ''} plugins={ALL_PLUGINS} onChange={(e) => setData({ data: e })} />
        </div>
    );
};

function useDebouncedEffect(callback: () => void, deps: any[], delay: number) {
    useEffect(() => {
        const handler = setTimeout(() => callback(), delay);
        return () => clearTimeout(handler);
    }, [...deps, delay]);
}

export default Block;

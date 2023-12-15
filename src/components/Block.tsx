// Block.tsx
import React, { useState } from 'react';
import { IBlock } from '../models/Block';
import { BlockService } from '../services/BlockService';
import { KitchenSinkToolbar, MDXEditor, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor';
import { BlockStorage, UseBlockStorage, UseDataService, useBlockDBService } from '../services/DBService';

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
    useBlock: BlockStorage;
}

const Block: React.FC<BlockProps> = ({ useBlock }) => {
    const { data, setData } = useBlock;

    return (
        <div>
            <input type="text" value={data?.title || ''} onChange={(e) => setData({ data: { title: e.target.value } })} />
            <MDXEditor markdown={data?.data || ''} plugins={ALL_PLUGINS} onChange={(e) => setData({ data: { data: e }})} />
        </div>
    );
};

export default Block;

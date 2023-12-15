// Block.tsx
import React, { useState } from 'react';
import { IBlock } from '../models/Block';
import { BlockService } from '../services/BlockService';
import { KitchenSinkToolbar, MDXEditor, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor';
import { useBlockDBService } from '../services/DBService';

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
    block?: IBlock;
}

const Block: React.FC<BlockProps> = ({ block }) => {
    const { updateMutation, createMutation } = useBlockDBService();

    const createOrUpdateBlock = (change: Omit<Partial<IBlock>, '_id' | '_rev'>) => {
        if (block && block._id) {
            updateMutation.mutate({ id: block._id, data: change});
        } else {
            createMutation.mutate(change);
        }
    }

    return (
        <div>
            <input type="text" value={block?.title || ''} onChange={(e) => createOrUpdateBlock({ title: e.target.value})} />
            <MDXEditor markdown={block?.data || ''} plugins={ALL_PLUGINS} onChange={(e) => createOrUpdateBlock({ data: e})} />
        </div>
    );
};

export default Block;

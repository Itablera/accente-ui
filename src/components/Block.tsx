// Block.tsx
import React, { useState } from 'react';
import { IBlock } from '../models/Block';
import { BlockService } from '../services/BlockService';
import { KitchenSinkToolbar, MDXEditor, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor';

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
    const [title, setTitle] = useState(block.title);
    const [content, setContent] = useState(block.data);

    const saveChanges = () => {
        // Implement saving logic
        BlockService.updateBlock(block.id, { ...block, title, data: content });
    };

    return (
        <div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <MDXEditor markdown={content} plugins={ALL_PLUGINS} onChange={(e) => setContent(e)} />
            <button onClick={saveChanges}>Save</button>
        </div>
    );
};

export default Block;

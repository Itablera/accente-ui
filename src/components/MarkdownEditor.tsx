import React from 'react';
import { MDXEditor, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, tablePlugin, thematicBreakPlugin } from '@mdxeditor/editor';

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

export const MarkdownEditor: React.FC = () => {  return (
    <div>
      <MDXEditor onChange={console.log} markdown='type here' plugins={ALL_PLUGINS} />
    </div>
  );
};

export default MarkdownEditor;

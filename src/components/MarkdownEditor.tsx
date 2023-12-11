import React from 'react';
import { MDXEditor, codeBlockPlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, tablePlugin, thematicBreakPlugin } from '@mdxeditor/editor';
import { monacoPlugin } from './CodeEditor';

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
  codeBlockPlugin({ defaultCodeBlockLanguage: 'txt', codeBlockEditorDescriptors: [monacoPlugin] }),
  markdownShortcutPlugin(),
]

const MarkdownEditor: React.FC = () => {  return (
    <div>
      <MDXEditor onChange={console.log} markdown='type here' plugins={ALL_PLUGINS} />
    </div>
  );
};

export default MarkdownEditor;

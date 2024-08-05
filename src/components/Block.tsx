import React, { ChangeEvent, useState } from 'react';
import { IBlockDoc } from '../models/Block';
import { ChangeCodeMirrorLanguage, ConditionalContents, DiffSourceToggleWrapper, InsertCodeBlock, InsertSandpack, MDXEditor, SandpackConfig, ShowSandpackInfo, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, frontmatterPlugin, headingsPlugin, imagePlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, sandpackPlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor';
import { useDebouncedFunction } from '../hooks/Debounce';
import { useBlock } from '../hooks/Block';

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim()

const simpleSandpackConfig: SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent
    },
  ]
}

export const ALL_PLUGINS = [
    //toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }), //Gets error about missing plugin or label viewMode
    listsPlugin(),
    quotePlugin(),
    headingsPlugin({allowedHeadingLevels: [1, 2, 3, 4, 5, 6]}),
    linkPlugin(),
    linkDialogPlugin(),
    imagePlugin(),
    tablePlugin(),
    thematicBreakPlugin(),
    frontmatterPlugin(),
    codeBlockPlugin({defaultCodeBlockLanguage: 'js'}),
    sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
    codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
    diffSourcePlugin({ diffMarkdown: 'An older version', viewMode: 'rich-text' }),
    toolbarPlugin({toolbarContents: () => (
      <DiffSourceToggleWrapper>
        <ConditionalContents
          options={[
              { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
              { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
              { fallback: () => ( <> 
              <InsertCodeBlock />
              <InsertSandpack />
            </>) }
            ]}
          />
        </DiffSourceToggleWrapper>)
      }),
    markdownShortcutPlugin()
  ]

interface BlockProps {
    block: IBlockDoc;
}

export const Block: React.FC<BlockProps> = ({ block }) => {
    const [ title, setTitle ] = useState(block.title);
    const [ data, setData ] = useState(block.data);
    const { setBlock: setPersistedData } = useBlock(block._id);
    const debouncedAPICall = useDebouncedFunction(setPersistedData, 5000)
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
            <MDXEditor 
              className="dark-theme dark-editor prose prose-invert"
              contentEditableClassName="dark-theme dark-editor prose prose-invert"
              markdown={data} 
              onChange={handleDataChange} 
              plugins={ALL_PLUGINS} />
        </div>
    );
};

export default Block;

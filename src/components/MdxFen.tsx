import '@mdxeditor/editor/style.css';
import type { ForwardedRef } from 'react';
import {
  // headingsPlugin,
  // listsPlugin,
  // quotePlugin,
  // thematicBreakPlugin,
  // markdownShortcutPlugin,
  // MDXEditor,
  // type MDXEditorMethods,
  // type MDXEditorProps,

  // Separator,
  // CodeToggle,
  // InsertCodeBlock,
  // InsertSandpack,
  // ConditionalContents,
  // ShowSandpackInfo,
  // InsertFrontmatter,
  // ChangeCodeMirrorLanguage,
  // TooltipWrap,
  // Button,
  // BlockTypeSelect,
  // InsertThematicBreak,
  // InsertAdmonition,
  // CreateLink,
  // ListsToggle,
  // ChangeAdmonitionType,
  NestedLexicalEditor,
  GenericJsxEditor,
  jsxPlugin,
  frontmatterPlugin,
  diffSourcePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  sandpackPlugin,
  KitchenSinkToolbar,
  type SandpackConfig,
  type JsxComponentDescriptor,
  jsxPluginHooks,
  Button,
  directivesPlugin,
  DirectiveDescriptor,
  GenericDirectiveEditor,
} from '@mdxeditor/editor';

import { MDXEditor, type MDXEditorMethods, type MDXEditorProps } from '@mdxeditor/editor/MDXEditor';
import { headingsPlugin } from '@mdxeditor/editor/plugins/headings';
import { listsPlugin } from '@mdxeditor/editor/plugins/lists';
import { quotePlugin } from '@mdxeditor/editor/plugins/quote';
import { thematicBreakPlugin } from '@mdxeditor/editor/plugins/thematic-break';
import { markdownShortcutPlugin } from '@mdxeditor/editor/plugins/markdown-shortcut';
import { linkPlugin } from '@mdxeditor/editor/plugins/link';
// import { linkDialogPlugin } from '@mdxeditor/editor/plugins/link-dialog';
import { imagePlugin } from '@mdxeditor/editor/plugins/image';
import { tablePlugin } from '@mdxeditor/editor/plugins/table';
// import { codeBlockPlugin } from '@mdxeditor/editor/plugins/codeblock';
// import { codeMirrorPlugin } from '@mdxeditor/editor/plugins/codemirror';
// import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo';
// import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles';
// import { InsertImage } from '@mdxeditor/editor/plugins/toolbar/components/InsertImage';
// import { InsertTable } from '@mdxeditor/editor/plugins/toolbar/components/InsertTable';
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar';


type EditorProps = {
  editorRef?: ForwardedRef<MDXEditorMethods> | null;
} & MDXEditorProps;

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

export const virtuosoSampleSandpackConfig: SandpackConfig = {
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
      initialSnippetContent: defaultSnippetContent,
    },
    {
      label: 'React',
      name: 'react',
      meta: 'live',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent,
    },
    {
      label: 'Vanilla',
      name: 'vanilla',
      meta: 'live vanilla',
      sandpackTheme: 'auto',
      sandpackTemplate: 'vanilla',
      snippetFileName: '/index.js',
      snippetLanguage: 'js',
      initialSnippetContent: `console.log('Hello world')`,
    },
    {
      label: 'Virtuoso',
      name: 'virtuoso',
      meta: 'live virtuoso',
      sandpackTemplate: 'react-ts',
      sandpackTheme: 'light',
      snippetFileName: '/App.tsx',
      initialSnippetContent: defaultSnippetContent,
      dependencies: {
        'react-virtuoso': 'latest',
        '@ngneat/falso': 'latest',
      },
      files: {
      },
    },
  ],
};


async function imageUploadHandler(image: File) {
  const formData = new FormData();
  formData.append('file', image);
  const response = await fetch('/api/uploads/new', {
    method: 'POST',
    body: formData,
  });
  try {
    const json = (await response.json()) as { data: { url: string } };
    return json?.data?.url;
  } catch (error) {
    return '/images/404.png';
  }
}

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'MyLeaf',
    kind: 'text',
    source: './external',
    props: [
      { name: 'foo', type: 'string' },
      { name: 'bar', type: 'string' },
    ],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Marker',
    kind: 'text',
    source: './external',
    props: [{ name: 'type', type: 'string' }],
    hasChildren: false,
    // Editor: GenericJsxEditor,
    Editor: () => {
      return (
        <div style={{ border: '1px solid red', padding: 8, margin: 8, display: 'inline-block' }}>
          <NestedLexicalEditor
            // @ts-expect-error - children is not a prop of NestedLexicalEditor
            getContent={(node) => node.children}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getUpdatedMdastNode={(mdastNode, children: any) => {
              return { ...mdastNode, children };
            }}
          />
        </div>
      );
    },
  },
  {
    name: 'BlockNode',
    kind: 'flow',
    source: './external',
    props: [],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: 'CustomImage',
    kind: 'flow',
    source: '@/app/components/CustomImage',
    props: [],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Video',
    kind: 'flow',
    source: '@/app/components/Video',
    props: [],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
];

const CalloutDirectiveDescriptor: DirectiveDescriptor = {
    name: 'callout',
    testNode(node) {
      return node.name === 'callout'
    },
    // set some attribute names to have the editor display a property editor popup.
    attributes: [],
    // used by the generic editor to determine whether or not to render a nested editor.
    hasChildren: true,
    Editor: GenericDirectiveEditor
  }


const InsertMyLeaf = () => {
    const insertJsx = jsxPluginHooks.usePublisher('insertJsx')
    return (
        <>
      <Button
        onClick={() =>
          insertJsx({
            name: 'MyLeaf',
            kind: 'text',
            props: { foo: 'bar', bar: 'baz' }
          })
        }
      >
        Leaf
      </Button>
      <Button
        onClick={() =>
          insertJsx({
            name: 'BlockNode',
            kind: 'flow',
            props: { foo: 'bar', bar: 'baz' }
          })
        }
      >
        Flow
      </Button>
      <Button
        onClick={() =>
          insertJsx({
            name: 'Marker',
            kind: 'text',
            props: { name: 'bar' }
          })
        }
      >
        Marker
      </Button>
      </>
    )
  }

export default function MdxFen({ editorRef, ...props }: EditorProps) {
  return (
    <MDXEditor
      contentEditableClassName='prose max-w-none'
      {...props}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        // linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler,
          // imagePreviewHandler: () => {
          //   return Promise.resolve('https://picsum.photos/200/300');
          // },
          // imageAutocompleteSuggestions: ['https://picsum.photos/200/300', 'https://picsum.photos/200'],
        }),
        tablePlugin(),
        frontmatterPlugin(),
        jsxPlugin({ jsxComponentDescriptors }),
        directivesPlugin({ directiveDescriptors: [ CalloutDirectiveDescriptor] }),
        diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: 'JavaScript',
            css: 'CSS',
            less: 'Less',
            scss: 'SCSS',
            txt: 'text',
            ts: 'TypeScript',
            tsx: 'TypeScript',
          },
        }),
        sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {/* <InsertSandpack />
              <Separator /> */}
                <InsertMyLeaf />
              <KitchenSinkToolbar />
            </>
          ),
          // toolbarContents: () => (
          //   <>
          //     <ConditionalContents
          //       options={[
          //         {
          //           when: (editor) => editor?.editorType === 'codeblock',
          //           contents: () => <ChangeCodeMirrorLanguage />,
          //         },
          //         { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
          //         {
          //           fallback: () => (
          //             <>
          //               <TooltipWrap title='Save to database'>
          //                 <div className='h-[32px] w-[29px]'>
          //                   <Button onClick={() => console.log('保存成功')}>💾</Button>
          //                 </div>
          //               </TooltipWrap>
          //               <UndoRedo />
          //               <Separator />
          //               <BoldItalicUnderlineToggles />
          //               <CodeToggle />
          //               <Separator />
          //               <ListsToggle />
          //               <Separator />

          //               <ConditionalContents
          //                 options={[
          //                   { when: whenInAdmonition, contents: () => <ChangeAdmonitionType /> },
          //                   { fallback: () => <BlockTypeSelect /> },
          //                 ]}
          //               />

          //               <Separator />

          //               <CreateLink />
          //               <InsertImage />

          //               <Separator />

          //               <InsertTable />
          //               <InsertThematicBreak />

          //               <Separator />
          //               <InsertCodeBlock />

          //               <Separator />
          //               <InsertSandpack />

          //               <ConditionalContents
          //                 options={[
          //                   {
          //                     when: (editorInFocus) => !whenInAdmonition(editorInFocus),
          //                     contents: () => (
          //                       <>
          //                         <Separator />
          //                         <InsertAdmonition />
          //                       </>
          //                     ),
          //                   },
          //                 ]}
          //               />

          //               <Separator />
          //               <InsertFrontmatter />
          //             </>
          //           ),
          //         },
          //       ]}
          //     />
          //   </>
          // ),
        }),
      ]}
      ref={editorRef}
    />
  );
}
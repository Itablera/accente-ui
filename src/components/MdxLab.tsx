import { Button, DialogButton, DiffSourceToggleWrapper, DirectiveDescriptor, GenericDirectiveEditor, GenericJsxEditor, JsxComponentDescriptor, MDXEditor, NestedLexicalEditor, diffSourcePlugin, directivesPlugin, directivesPluginHooks, headingsPlugin, imagePlugin, jsxPlugin, jsxPluginHooks, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, toolbarPlugin } from "@mdxeditor/editor"
import { ContainerDirective, LeafDirective } from 'mdast-util-directive'
import { jsxEvaluatePlugin } from "../mdx-editor-plugins/evaluate-jsx"

const markdown = `
import { MyLeaf } from './external'

<MyLeaf foo="bar" bar="baz">
  {2*2}
</MyLeaf>

> This is a quote

- list item 1
- list item 2

`

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
    {
      name: 'MyLeaf',
      kind: 'text', // 'text' for inline, 'flow' for block
      // the source field is used to construct the import statement at the top of the markdown document. 
      // it won't be actually sourced.
      source: './external',
      // Used to construct the property popover of the generic editor
      props: [
        { name: 'foo', type: 'string' },
        { name: 'bar', type: 'string' }
      ],
      // whether the component has children or not
      hasChildren: true,
      Editor: GenericJsxEditor
    },
    {
      name: 'Marker',
      kind: 'text',
      source: './external',
      props: [{ name: 'type', type: 'string' }],
      hasChildren: false,
      Editor: () => {
        return (
          <div style={{ border: '1px solid red', padding: 8, margin: 8, display: 'inline-block' }}>
            <NestedLexicalEditor
            //@ts-expect-error - children is not a prop of NestedLexicalEditor
              getContent={(node) => node.children}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              getUpdatedMdastNode={(mdastNode, children: any) => {
                return { ...mdastNode, children }
              }}
            />
          </div>
        )
      }
    },
    {
      name: 'BlockNode',
      kind: 'flow',
      source: './external',
      props: [],
      hasChildren: true,
      Editor: GenericJsxEditor
    }
  ]
  
  // a toolbar button that will insert a JSX element into the editor.
  const InsertMyLeaf = () => {
    const insertJsx = jsxPluginHooks.usePublisher('insertJsx')
    return (
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
    )
  }

  const InsertMyLeaf2 = () => {
    const insertJsx = jsxPluginHooks.usePublisher('insertJsx')
    return (
      <Button
        onClick={() =>
          insertJsx({
            name: 'MyLeaf',
            kind: 'text',
            props: { foo: 'bar', bar: 'baz' }
          })
        }
      >
        Other
      </Button>
    )
  }

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

  const YoutubeDirectiveDescriptor: DirectiveDescriptor = {
    name: 'youtube',
    testNode(node) {
      return node.name === 'youtube'
    },
    attributes: [],
    hasChildren: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Editor: (props) => {
      return (
        <div style={{ border: '1px solid red', padding: 8, margin: 8 }}>
          <NestedLexicalEditor<ContainerDirective>
            block
            getContent={(node) => node.children}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getUpdatedMdastNode={(mdastNode, children: any) => {
              return { ...mdastNode, children }
            }}
          />
        </div>
      )
    }
  }

  const YouTubeButton = () => {
    // grab the insertDirective action (a.k.a. publisher) from the 
    // state management system of the directivesPlugin
    const insertDirective = directivesPluginHooks.usePublisher('insertDirective')
  
    return (
      <DialogButton
        tooltipTitle="Insert Youtube video"
        submitButtonTitle="Insert video"
        dialogInputPlaceholder="Paste the youtube video URL"
        buttonContent="YT"
        onSubmit={(url) => {
          const videoId = new URL(url).searchParams.get('v')
          if (videoId) {
            insertDirective({
              name: 'youtube',
              type: 'leafDirective',
              attributes: { id: videoId },
              children: []
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as LeafDirective)
          } else {
            alert('Invalid YouTube URL')
          }
        }}
      />
    )
  }
  
  
  export const MdxLab = () => {
    return (
      <MDXEditor
        className="dark-theme dark-editor"
        markdown={markdown} // the contents of the file  below
        onChange={console.log}
        plugins={[
          quotePlugin(),
          listsPlugin(),
          headingsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          jsxPlugin({ jsxComponentDescriptors }),
          jsxEvaluatePlugin(),
          diffSourcePlugin({ diffMarkdown: 'An older version', viewMode: 'rich-text' }),
          directivesPlugin({ directiveDescriptors: [CalloutDirectiveDescriptor, YoutubeDirectiveDescriptor] }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <DiffSourceToggleWrapper>
                  <InsertMyLeaf />
                  <InsertMyLeaf2 />
                  <YouTubeButton />
                </DiffSourceToggleWrapper>
              </>
              
            )
          }),
          markdownShortcutPlugin()
        ]}
      />
    )
  }
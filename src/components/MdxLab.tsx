import { insertCodeBlock$, Button, CreateImageNodeParameters, DialogButton, DiffSourceToggleWrapper, DirectiveDescriptor, GenericDirectiveEditor, GenericJsxEditor, JsxComponentDescriptor, MDXEditor, NestedLexicalEditor, currentSelection$, diffSourcePlugin, directivesPlugin, editorInFocus$, headingsPlugin, imagePlugin, insertDirective$, insertJsx$, jsxPlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdown$, markdownShortcutPlugin, quotePlugin, rootEditor$, toolbarPlugin, useCellValues, usePublisher, codeBlockPlugin, codeMirrorPlugin } from "@mdxeditor/editor"
import { LeafDirective, ContainerDirective } from 'mdast-util-directive'
import { MdxJsxTextElement, MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import { Blockquote } from 'mdast'
import { jsxEvaluatePlugin } from "../mdx-editor-plugins/evaluate-jsx"
import { catchAllPlugin } from "../mdx-editor-plugins/catch-all"

const markdown1 = `
import { CustomTextEditor } from './external'

<CustomTextEditor foo="bar" bar="baz">
  {2*2}
</CustomTextEditor>
`

const markdown2 = `
import { Card } from './external'

<Card foo="bar">
  foo
</Card>
`

const markdown4 = `
asd
`

const markdown = `
asd
`

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
    {
      name: 'List',
      kind: 'text',
      source: './external',
      props: [
        { name: 'foo', type: 'string' },
      ],
      hasChildren: true,
      Editor: () => {
        const list = [
          'foo',
          'bar',
          'baz'
        ];
        
        return (
          <ul>
            {list.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        )
      }
    },
    {
      name: 'Card',
      kind: 'text',
      source: './external',
      props: [
        { name: 'foo', type: 'string' },
      ],
      hasChildren: true,
      Editor: GenericJsxEditor
    },        
    {
      name: 'TextEditor',
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
      name: 'CustomTextEditor',
      kind: 'text',
      source: './external',
      props: [
        { name: 'foo', type: 'string' },
        { name: 'bar', type: 'string' }
      ],
      hasChildren: false,
      Editor: () => {
        return (
          <div style={{ border: '1px solid red' }}>
            <NestedLexicalEditor<MdxJsxTextElement | MdxJsxFlowElement>
              block={false}
              getContent={(node) => {
                const manipulated = node.children.map((child) => {
                  if (child.type === 'paragraph') {
                    const newChild: Blockquote = {
                      type: 'blockquote',
                      children: [{ type: 'paragraph', children: [{ type: 'text', value: child.children[0].value }] }]
                    }
                    return newChild
                  } else {
                    return child
                  }
                })
                return manipulated
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              getUpdatedMdastNode={(mdastNode, children: any) => {
                return {
                  ...mdastNode,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  children
                }
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
  const InsertCard = () => {
    const insertJsx = usePublisher(insertJsx$)
    return (
      <Button
        onClick={() =>
          insertJsx({
            name: 'Card',
            kind: 'text',
            props: { foo: 'bar' }
          })
        }
      >
        Card
      </Button>
    )
  }

  const InsertList = () => {
    const insertJsx = usePublisher(insertJsx$)
    return (
      <Button
        onClick={() =>
          insertJsx({
            name: 'List',
            kind: 'text',
            props: { foo: 'bar'}
          })
        }
      >
        InsertList
      </Button>
    )
  }

  const InsertTextEditor = () => {
    const insertJsx = usePublisher(insertJsx$)
    return (
      <Button
        onClick={() =>
          insertJsx({
            name: 'TextEditor',
            kind: 'text',
            props: { foo: 'bar', bar: 'baz' }
          })
        }
      >
        InsertTextEditor
      </Button>
    )
  }

  const InsertCustomEditor = () => {
    const insertJsx = usePublisher(insertJsx$)
    return (
      <Button
        onClick={() =>
          insertJsx({
            name: 'CustomTextEditor',
            kind: 'text',
            props: { foo: 'bar', bar: 'baz' }
          })
        }
      >
        InsertCustomEditor
      </Button>
    )
  }

  const InsertBlockEditor = () => {
    const insertJsx = usePublisher(insertJsx$)
    return (
      <Button
        onClick={() =>
          insertJsx({
            name: 'BlockNode',
            kind: 'flow',
            props: { }
          })
        }
      >
        InsertBlockEditor
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
    const insertDirective = usePublisher(insertDirective$)
  
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
        className="dark-theme dark-editor prose prose-invert"
        contentEditableClassName="dark-theme dark-editor prose prose-invert"
        markdown={markdown} // the contents of the file  below
        onChange={console.log}
        plugins={[
          quotePlugin(),
          listsPlugin(),
          headingsPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
          codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
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
                  <InsertList /><>  </>
                  <InsertTextEditor /><>  </>
                  <InsertCustomEditor /><>  </>
                  <YouTubeButton /><>  </>
                  <InsertCard /><>  </>
                  <InsertBlockEditor /><>  </>
                </DiffSourceToggleWrapper>
              </>
              
            )
          }),
          markdownShortcutPlugin(),
          catchAllPlugin()
        ]}
      />
    )
  }
import { MdastImportVisitor } from '@mdxeditor/editor'
import { $createTextNode } from 'lexical'
import { $createLexicalJsxNode } from '../../../node_modules/@mdxeditor/editor/dist/plugins/jsx/LexicalJsxNode'
import { ElementNode } from 'lexical'
import { MdxFlowExpression } from 'mdast-util-mdx'
import { MdxJsxFlowElement } from 'mdast-util-mdx-jsx'

export const MdastMdxJsxExpressionVisitor: MdastImportVisitor<MdxFlowExpression> = {
  testNode: (node) => {
    return node.type === 'mdxTextExpression' || node.type === 'mdxFlowExpression'
  },
  visitNode({ mdastNode, actions }) {
    actions.addAndStepInto($createTextNode(eval(mdastNode.value) as string).setFormat(actions.getParentFormatting()))
  },
  /*visitNode({ lexicalParent, mdastNode }) {
    // Evaluate MdxFlowExpression and convert to MdxJsxTextElement
    const mdxJsxTextElement: MdxJsxFlowElement = {
      type: 'mdxJsxFlowElement',
      name: 'Grid',
      attributes: [],
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: eval(mdastNode.value) as string
            }
          ]
        }
      ]
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(lexicalParent as ElementNode).append($createLexicalJsxNode(mdxJsxTextElement as any))
  },*/
  priority: -200
}

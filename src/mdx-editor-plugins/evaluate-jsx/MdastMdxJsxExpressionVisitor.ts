import { MdastImportVisitor } from '@mdxeditor/editor'
import { $createTextNode } from 'lexical'
import { MdxFlowExpression } from 'mdast-util-mdx'

export const MdastMdxJsxExpressionVisitor: MdastImportVisitor<MdxFlowExpression> = {
  testNode: (node) => {
    return node.type === 'mdxTextExpression' || node.type === 'mdxFlowExpression'
  },
  visitNode({ mdastNode, actions }) {
    /**
     * Assumes there is a parent ElementNode or it will fail as only ElementNodes or Decorator nodes may be appended to Root node
     */
    actions.addAndStepInto($createTextNode(eval(mdastNode.value) as string).setFormat(actions.getParentFormatting()))
  },
  priority: -200
}

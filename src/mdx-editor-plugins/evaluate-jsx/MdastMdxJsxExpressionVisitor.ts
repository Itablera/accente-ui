import { MdastImportVisitor } from '@mdxeditor/editor'
import { $createTextNode, $createParagraphNode } from 'lexical'
import { MdxFlowExpression } from 'mdast-util-mdx'

export const MdastMdxJsxExpressionVisitor: MdastImportVisitor<MdxFlowExpression> = {
  testNode: (node) => {
    return node.type === 'mdxTextExpression' || node.type === 'mdxFlowExpression'
  },
  visitNode({ mdastNode, actions }) {
    const paragraph = $createParagraphNode()
    paragraph.append($createTextNode(eval(mdastNode.value) as string).setFormat(actions.getParentFormatting()))
    actions.addAndStepInto(paragraph)
  },
  priority: -200
}

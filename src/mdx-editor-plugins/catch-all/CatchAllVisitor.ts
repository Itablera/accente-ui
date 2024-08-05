import { MdastImportVisitor } from "@mdxeditor/editor";
import { $createTextNode, $createParagraphNode } from 'lexical'
import Mdast from 'mdast';

export const CatchAllVisitor: MdastImportVisitor<Mdast.Content> = {
    testNode: () => true,
    visitNode: ({ mdastNode, actions }) => {
        const paragraph = $createParagraphNode()
    
        if (mdastNode.type === 'mdxFlowExpression' || mdastNode.type === 'mdxTextExpression') {
          paragraph.append($createTextNode(mdastNode.value))
        }
    
        console.warn('catch all', { mdastNode })
        actions.addAndStepInto(paragraph)
    },
    priority: -500
};

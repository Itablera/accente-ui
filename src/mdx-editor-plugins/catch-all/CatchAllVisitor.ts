import { MdastImportVisitor } from "@mdxeditor/editor";
import { $createTextNode } from 'lexical'
import Mdast from 'mdast';

export const CatchAllVisitor: MdastImportVisitor<Mdast.Content> = {
    testNode: () => true,
    visitNode: ({ mdastNode, actions }) => {
        console.warn('catch all', { mdastNode });
        actions.addAndStepInto($createTextNode());
    },
    priority: -500
};

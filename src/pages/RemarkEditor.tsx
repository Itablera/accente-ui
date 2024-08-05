import React, { Fragment, createElement, useEffect, useState } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import rehypeReact from 'rehype-react';
import rehypeParse from 'rehype-parse';
import remarkRehype from 'remark-rehype';
import * as prod from 'react/jsx-runtime'
import {toHast } from 'mdast-util-to-hast'
import {Nodes, Root} from 'mdast'

/**
 * Idea
 * 1. MDAST is master, init markdown is to be converted to MDAST
 * 2. Add unique id to each node in MDAST
 * 3. Convert MDAST to HAST
 * 4. Convert HAST to HTML
 * 
 */
////


const markdown = `
# Sample H1
Some text
- list item 1
- list item 2
`


const addIdIfMissing = () => {
    return function transformer(tree: Root) {
        tree.children.forEach((child) => {
            if (child.type === 'list' && !child.data?.hProperties?.id) {
                child.data = child.data || {};
                child.data.hProperties = child.data.hProperties || {};
                child.data.hProperties.id = getUniqueId();
            }
        });
    };
}

const RemarkEditor: React.FC = () => {

    const initialMdastTree = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(addIdIfMissing)
        .parse(markdown);

    const [mdastTree, setMdastTree] = useState(initialMdastTree);

    return (
        <div>
            <RenderMdast tree={mdastTree} />
        </div>
    );
}

export default RemarkEditor;
function getUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
}

// @ts-expect-error: the react types are missing.
const production = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs}

const RenderMdast: React.FC<{tree: Root}> = ({tree}) => {
    const [Content, setContent] = useState(createElement(Fragment))

    const initialMdastTree = unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeParse, {fragment: true})
        .use(rehypeReact, production)
        .processSync(tree); 

    setContent(initialMdastTree.result);

    return Content
}
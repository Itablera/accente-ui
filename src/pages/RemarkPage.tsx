import React, { useState } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import remarkRehype from 'remark-rehype';
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize from 'rehype-sanitize'
import rehypeRaw from 'rehype-raw';
import {toHast} from 'mdast-util-to-hast'
import {toMdast} from 'hast-util-to-mdast'
import {compile, nodeTypes, run} from '@mdx-js/mdx'
import {VFile} from 'vfile'

const markdown = `
# Sample H1
- list item 1
- list item 2

## Sample H2
- list item 1
- list item 2

\`\`\`js
const foo = 'bar';
\`\`\`
`

const RemarkPage: React.FC = () => {
    const [markdownInput, setMarkdownInput] = useState<string>(markdown);
    const [htmlOutput, setHtmlOutput] = useState<string>('');


    // Function to convert Markdown to mdast
    const markdownToMdast = (markdown: string) => {
        const mdastResult = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .parse(markdown);

        return mdastResult;
    };



    const markdownToHast = (markdown: string) => {
        const hastResult = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeDocument)
            .use(rehypeFormat)
            .parse(markdown);
        return hastResult;
    };

    // Function to convert MDAST to Markdown
    const mdastToMarkdown = (mdastNode: any) => {
        const result = unified()
            .use(remarkStringify)
            .stringify(mdastNode)
        return result;
    }

    // Function to convert MDAST to HTML
    const mdastToHtml = (mdastNode: any) => {
        const hast = toHast(mdastNode);
        const html = hastToHtml(hast);
        return html;
    };
  
    // Function to convert HAST to HTML
    const hastToHtml = (hastNode: any) => {
        return unified()
        .use(rehypeParse)
        //.use(rehypeDocument)
        //.use(rehypeRaw) // Optional: If you need to handle raw HTML elements
        .use(rehypeStringify)
        .stringify(hastNode)
    };

    // Function to convert HAST to Markdown
    const hastToMarkdown = (hastNode: any) => {
        const mdast = toMdast(hastNode);
        return unified()
        .use(rehypeParse)
        .use(rehypeStringify)
        .use(remarkRehype)
        .use(remarkStringify)
        .stringify(hastNode)
    };

    const convertMarkdownToHtml = () => {
        const mdastOutput = markdownToMdast(markdownInput);
        const html = mdastToHtml(mdastOutput);
        setHtmlOutput(html);
    }
  
    // Example usage:
    const mdastOutput = markdownToMdast(markdownInput);
    const hastOutput = markdownToHast(markdownInput);
    //const htmlOutput1 = hastToHtml(hastOutput);
    //const markdownOutput1 = hastToMarkdown(hastOutput);
    const markdownOutput2 = mdastToMarkdown(mdastOutput);
    const htmlOutput2 = mdastToHtml(mdastOutput);

    /** 
      * addTextArea is a function that:
      * 1. Takes a MDAST tree as input
      * 2. Converts the MDAST tree to HTML
      * 3. Appends a textarea for each MDAST node, this textarea is hidden unitl the user clicks on the node
      */
    const addTextArea = (node: any) => {
        const html = mdastToHtml(node);
        const textarea = document.createElement('textarea');
        textarea.value = html;
        textarea.style.display = 'none';
        node.appendChild(textarea);
        return node;
    }
    


    return (
        <div>
            <h1>Markdown to HTML and Back</h1>
            <div>
                <h2>Markdown Input</h2>
                <textarea
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                rows={5}
                cols={50}
                />
            </div>
            <div>
                <h2>HTML Output</h2>
                {forEachNode(mdastOutput)}
            </div>
        </div>
    );
};

export default RemarkPage;

import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import rehypeReact from 'rehype-react';
import rehypeStringify from 'rehype-stringify';
import remarkStringify from 'remark-stringify';
import remarkRehype from 'remark-rehype';
import {visit} from 'unist-util-visit'
import {Root} from 'mdast'
import { ElementContent, Parent} from 'hast'

const markdown = `
# Sample H1
- list item 1
- list item 2
`;

function addTextareas() {
  return function transformer(tree: Parent) {
    // Recursively traverse the MDAST tree and add textareas for each node
    visit(tree, 'element', function (node) {
      /*if (node.type === 'element' && node.tagName === 'textarea') {
        // Skip textarea elements, as they are already present
        return;
      }*/

      /*if (node.children) {
        node.children = node.children.map(visit);
      }*/

      if (node.type === 'element' && node.tagName === 'li' && node.tagName !== 'textarea') {
        /*const textareaNode = {
          type: 'element',
          tagName: 'textarea',
          properties: {},
          children: [{ type: 'text', value: node.value }],
        };*/
        const newNode: ElementContent = {
            type: 'element',
            tagName: 'textarea',
            properties: {},
            children: [{ type: 'text', value: node.children[0].value || '' }],
        }; 

        node.children.push(newNode);
      }

      /*if (node.tagName === 'h1') {
        node.tagName = 'h2';
      }*/
    });
  };
}

const part = unified()
.use(remarkParse)
.use(remarkRehype)
.use(rehypeStringify)
.processSync(markdown)

const part2 = unified()
.use(remarkParse)
.use(remarkRehype)
.use(addTextareas)
.use(rehypeStringify)
.processSync(markdown)

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(addTextareas)
  .use(rehypeStringify);

function MarkdownEditor() {
  const htmlString = processor.processSync(markdown).toString();
  console.log(htmlString);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
  );
}

export default MarkdownEditor;


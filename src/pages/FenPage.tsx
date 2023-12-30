import { Suspense, useRef, useState } from 'react';
import {MDXEditorMethods} from '@mdxeditor/editor';
import MdxFen from '../components/MdxFen';

const defaultSnippetContent_org = `

# Hello world!
{2*2}
## Table

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | 600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |


Image with dimensions:

<img src="https://images.unsplash.com/photo-1517935706615-2717063c2225" width="500" height="auto" />
`;

const defaultSnippetContent = `
import { MyLeaf } from './external'

<MyLeaf foo="bar" bar="baz">{2*2}</MyLeaf>
`;

export default function FenPage() {

  const [content, setContent] = useState(defaultSnippetContent);
  const onContentChange = (text: string) => {
    setContent(text);
  };
  const ref = useRef<MDXEditorMethods>(null);
  return (
    <>
      <button
        type='button'
        className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
        onClick={() => ref.current?.setMarkdown('new markdown')}
      >
        Set new markdown
      </button>
      <button
        type='button'
        className='inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        onClick={() => console.log(ref.current?.getMarkdown())}
      >
        Get markdown
      </button>
      <Suspense fallback={<div>Loading...</div>}>
        <MdxFen editorRef={ref} markdown={content} onChange={onContentChange} />
      </Suspense>
    </>
  );
}
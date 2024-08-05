
import React, { FormEvent, FormEventHandler, useEffect, useState } from 'react';
import { MDXProvider } from '@mdx-js/react'
import { compileSync, runSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'


export const MdxCompilePage: React.FC = () => {
    const [content, setContent] = useState('# test');

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const code = String(compileSync(e.target.value, {outputFormat: 'function-body'}))
        //@ts-expect-error - baseUrl is not in the official MDX API
        const compiled = runSync(code, {...runtime, baseUrl: import.meta.url});//e.target.value
        setContent(compiled.default());
    }

    const onDivChange = (event: FormEvent<HTMLDivElement>) => {
        const code = String(compileSync(event.toString(), {outputFormat: 'function-body'}))
        //@ts-expect-error - baseUrl is not in the official MDX API
        const compiled = runSync(code, {...runtime, baseUrl: import.meta.url});//e.target.value
        setContent(compiled.default());
    }

    const onContentBlur = React.useCallback(evt => {
        const code = String(compileSync(evt.currentTarget.innerHTML, {outputFormat: 'function-body'}))
        //@ts-expect-error - baseUrl is not in the official MDX API
        const compiled = runSync(code, {...runtime, baseUrl: import.meta.url});//e.target.value
        setContent(compiled.default())
    }, [])

    //<textarea defaultValue={'test'} onChange={onChange} />
    //{content}
    //<textarea defaultValue={'test'} onChange={onChange} />
    //<textarea id="foo" onChange={onChange}>{content}</textarea>
                //<div contentEditable={true} onChange={onDivChange}>{content}</div>
                //{content}

    
                // <div 
                // contentEditable
                // onBlur={onContentBlur}
                // dangerouslySetInnerHTML={{__html: content}} />

    return (
        <div className='prose prose-stone prose-invert'>
            <MDXProvider>
                <div contentEditable={true} onBlur={onContentBlur}>{content}</div>
            </MDXProvider>
        </div>
    );
};

export default MdxCompilePage;
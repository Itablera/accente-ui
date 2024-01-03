
import React from 'react';
import MDX from './mdx.mdx'

export const MdxPage: React.FC = () => {

    return (
        <div className='prose prose-stone prose-invert'>
            <MDX class='prose' />
        </div>
    );
};

export default MdxPage;
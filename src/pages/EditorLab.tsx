// pages/ListBlocksPage.tsx
import React from 'react';
import { CodeEditor, MarkdownEditor} from '../components';

export const EditorLabPage: React.FC = () => {

    return (
        <div>
            <CodeEditor />
            <MarkdownEditor />
        </div>
    );
};

export default EditorLabPage;

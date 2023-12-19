// pages/ListBlocksPage.tsx
import React from 'react';
import { CodeEditor} from '../components/CodeEditor';
import MarkdownEditor from '../components/MarkdownEditor';

export const EditorLabPage: React.FC = () => {

    return (
        <div>
            <CodeEditor />
            <MarkdownEditor />
        </div>
    );
};

export default EditorLabPage;

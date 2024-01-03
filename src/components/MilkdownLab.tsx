
import React from 'react';
import { Editor, defaultValueCtx, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';
import { block } from '@milkdown/plugin-block';
import { cursor } from '@milkdown/plugin-cursor';
import { ProsemirrorAdapterProvider, usePluginViewFactory } from '@prosemirror-adapter/react';
import { SlashView, slash } from './MilkdownSlash';
import { BlockView } from './MilkdownBlock';    

import '@milkdown/theme-nord/style.css';

const defaultValue = `
# Title

- list1
- list2
- list3

> quote

\`\`\`typescript
const a = 1;
\`\`\`
`;

const MilkdownEditor: React.FC = () => {
    const pluginViewFactory = usePluginViewFactory();
    
    useEditor((root) => {
      return Editor.make()
        .config(nord)
        .config((ctx) => {
            ctx.set(rootCtx, root)
            ctx.set(defaultValueCtx, defaultValue)
            ctx.set(slash.key, {
              view: pluginViewFactory({
                component: SlashView,
              })
            })
            ctx.set(block.key, {
              view: pluginViewFactory({
              component: BlockView,
              })
            })
        })
        .use(commonmark)
        .use(slash)
        .use(block)
        .use(cursor)
    }, []);

  return <Milkdown />;
};

export const MilkdownEditorWrapper: React.FC = () => {
  return (
    <MilkdownProvider>
        <ProsemirrorAdapterProvider>
            <MilkdownEditor />
        </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );
};
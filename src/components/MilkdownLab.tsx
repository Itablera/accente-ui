
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
import './milkdown.css';
import { splitEditing } from '@milkdown-lab/plugin-split-editing';

const markdown =
`# Milkdown React Slash

> You're scared of a world where you're needed.



- item 1
- item 2
- item 3q

This is a demo for using Milkdown with **React**.

Type \`/\` to see the slash command.`

export const MilkdownEditor: React.FC = () => {
    const pluginViewFactory = usePluginViewFactory();
    
    useEditor((root) => {
      return Editor
        .make()
        .config(ctx => {
          ctx.set(rootCtx, root)
          ctx.set(defaultValueCtx, markdown)
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
        .config(nord)
        .use(commonmark)
        .use(slash)
        .use(block)
        .use(cursor)
        //@ts-expect-error - splitEditing is not in the official Milkdown API
        .use(splitEditing)
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
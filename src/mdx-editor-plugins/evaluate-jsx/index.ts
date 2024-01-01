import { MdastJsx, jsxSystem, realmPlugin } from '@mdxeditor/editor'
import React from 'react'
import { MdastMdxJsxExpressionVisitor } from './MdastMdxJsxExpressionVisitor'

/**
 * Defines the structure of a JSX component property.
 */
export interface JsxPropertyDescriptor {
  /**
   * The name of the property
   */
  name: string
  /**
   * The type of the property
   */
  type: 'string' | 'number'
  /**
   * Wether the property is required
   */
  required?: boolean
}

/**
 * Defines the structure of a JSX component that can be used within the markdown document.
 */
export interface JsxComponentDescriptor {
  /**
   * The tag name
   */
  name: string
  /**
   * Wether the component is a flow or text component (inline or block)
   */
  kind: 'flow' | 'text'
  /**
   * The module path from which the component can be imported
   * Omit to skip injecting an import statement
   */
  source?: string
  /**
   * Wether the component is the default export of the module
   */
  defaultExport?: boolean
  /**
   * The properties that can be applied to the component
   */
  props: JsxPropertyDescriptor[]
  /**
   * Wether or not the component has children
   */
  hasChildren?: boolean

  /**
   * The editor to use for editing the component
   */
  Editor: React.ComponentType<JsxEditorProps>
}

/**
 * The properties passed to a JSX Editor component.
 */
export interface JsxEditorProps {
  /** The MDAST node to edit */
  mdastNode: MdastJsx
  descriptor: JsxComponentDescriptor
}

/**
 * The parameters of the `jsxPlugin`.
 */
export interface JsxPluginParams {
}

export const [
  /** @internal */
  jsxEvaluatePlugin,
  /** @internal */
  jsxEvaluatePluginHooks
] = realmPlugin({
  id: 'evaluate-jsx',
  dependencies: ['jsx'],
  systemSpec: jsxSystem,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init: (realm, _: JsxPluginParams) => {
    // import
    realm.pubKey('addImportVisitor', MdastMdxJsxExpressionVisitor)

    // export
  }
})

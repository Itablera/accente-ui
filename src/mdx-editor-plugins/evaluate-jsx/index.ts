import { jsxSystem, realmPlugin } from '@mdxeditor/editor'
import { MdastMdxJsxExpressionVisitor } from './MdastMdxJsxExpressionVisitor'

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

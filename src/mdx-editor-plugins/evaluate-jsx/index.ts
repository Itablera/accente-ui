import { addImportVisitor$, realmPlugin } from '@mdxeditor/editor'
import { MdastMdxJsxExpressionVisitor } from './MdastMdxJsxExpressionVisitor'

/**
 * The parameters of the `jsxPlugin`.
 */
export interface JsxPluginParams {
}

export const jsxEvaluatePlugin = realmPlugin({
  init: (realm) => {
    realm.pub(addImportVisitor$, MdastMdxJsxExpressionVisitor)
  }
})

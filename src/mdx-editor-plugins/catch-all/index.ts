import { addImportVisitor$, realmPlugin } from "@mdxeditor/editor"
import { CatchAllVisitor } from "./CatchAllVisitor"

  export const catchAllPlugin = realmPlugin({
    init(realm) {
      realm.pub(addImportVisitor$, CatchAllVisitor)
    }
  })
  
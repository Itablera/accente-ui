/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { JsxEditorProps, PropertyPopover, useMdastNodeUpdater } from '@mdxeditor/editor'
import { MdxJsxAttribute } from 'mdast-util-mdx-jsx'
import React from 'react'


/**
 * A generic editor that can be used as an universal UI for any JSX element.
 * Allows editing of the element content and properties.
 * Use this editor for the {@link JsxComponentDescriptor} Editor option.
 */
export const MdxCard: React.FC<JsxEditorProps> = ({ mdastNode, descriptor }) => {
  const updateMdastNode = useMdastNodeUpdater()

  const properties = React.useMemo(() => {
    return descriptor.props.reduce((acc, descriptor) => {
      const attribute = mdastNode.attributes.find((attr) => (attr as MdxJsxAttribute).name === descriptor.name)
      if (attribute) {
        acc[descriptor.name] = attribute.value as string
      } else {
        acc[descriptor.name] = ''
      }
      return acc
    }, {} as Record<string, string>)
  }, [mdastNode, descriptor])

  const onChange = React.useCallback(
    (values: Record<string, string>) => {
      const newAttributes = mdastNode.attributes.slice()

      Object.entries(values).forEach(([key, value]) => {
        const attributeToUpdate = newAttributes.find((attr) => (attr as MdxJsxAttribute).name === key)
        if (value === '') {
          if (attributeToUpdate) {
            newAttributes.splice(newAttributes.indexOf(attributeToUpdate), 1)
          }
        } else {
          if (attributeToUpdate) {
            attributeToUpdate.value = value
          } else {
            newAttributes.push({
              type: 'mdxJsxAttribute',
              name: key,
              value: value
            })
          }
        }
      })
      updateMdastNode({ attributes: newAttributes })
    },
    [mdastNode, updateMdastNode]
  )

  return (
    <div className={descriptor.kind === 'text' ? 'inlineEditor' : 'blockEditor'}>
      {descriptor.props.length == 0 && descriptor.hasChildren && descriptor.kind === 'flow' ? (
        <span className="mdxcard">{mdastNode.name}</span>
      ) : null}

      {descriptor.props.length > 0 ? <PropertyPopover properties={properties} title={mdastNode.name || ''} onChange={onChange} /> : null}
      {descriptor.hasChildren ? (
            <span className="mdxcard">
                <button>foo: {properties['foo']} value: { mdastNode?.children[0]?.type === 'paragraph' && mdastNode?.children[0].children[0]?.type === 'text' && mdastNode.children[0].children[0].value}</button>
            </span>
      ) : (
        <span className="mdxcard">{mdastNode.name}</span>
      )}
    </div>
  )
}


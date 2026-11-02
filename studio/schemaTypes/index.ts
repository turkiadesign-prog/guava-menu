
import {defineType, defineField} from 'sanity'
import {menuItem} from './menuItem'

export const schemaTypes = [
  defineType({
    name: 'menuSection',
    title: 'Menu Sections',
    type: 'document',
    fields: [
      defineField({
        name: 'name',
        title: 'Section Name',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'slug',
        title: 'Section ID',
        type: 'slug',
        options: {source: 'name'},
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'order',
        title: 'Display Order',
        type: 'number',
        initialValue: 0,
      }),
      defineField({
        name: 'visible',
        title: 'Show on Website',
        type: 'boolean',
        initialValue: true,
      }),
    ],
  }),

  defineType({
    name: 'menuCategory',
    title: 'Menu Categories',
    type: 'document',
    fields: [
      defineField({
        name: 'nameEn',
        title: 'Category Name (English)',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'nameRo',
        title: 'Category Name (Romanian)',
        type: 'string',
      }),
      defineField({
        name: 'section',
        title: 'Menu Section',
        type: 'reference',
        to: [{type: 'menuSection'}],
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'parentCategory',
        title: 'Parent Category (optional)',
        type: 'reference',
        to: [{type: 'menuCategory'}],
        description: 'Use only for subcategories',
      }),
      defineField({
        name: 'order',
        title: 'Display Order',
        type: 'number',
        initialValue: 0,
      }),
      defineField({
        name: 'visible',
        title: 'Show on Website',
        type: 'boolean',
        initialValue: true,
      }),
    ],
    preview: {
      select: {
        title: 'nameEn',
        subtitle: 'nameRo',
      },
    },
  }),

  menuItem,
]

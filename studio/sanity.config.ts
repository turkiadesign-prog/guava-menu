
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Guava Menu',
  projectId: '9tcimamh',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Guava Menu')
          .items(
            [
              {title: 'Food', id: 'guava-section-food'},
              {title: 'Drinks', id: 'guava-section-drinks'},
              {title: 'Shisha', id: 'guava-section-shisha'},
            ].map((section) =>
              S.listItem()
                .title(section.title)
                .id(section.id)
                .child(
                  S.documentTypeList('menuCategory')
                    .title(`${section.title} Categories`)
                    .filter(
                      '_type == "menuCategory" && section._ref == $sectionId'
                    )
                    .params({sectionId: section.id})
                    .defaultOrdering([
                      {field: 'order', direction: 'asc'},
                    ])
                    .child((categoryId) =>
                      S.documentList()
                        .title('Products')
                        .schemaType('menuItem')
                        .filter(
                          '_type == "menuItem" && category._ref == $categoryId'
                        )
                        .params({categoryId})
                        .defaultOrdering([
                          {field: 'order', direction: 'asc'},
                        ])
                    )
                )
            )
          ),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})

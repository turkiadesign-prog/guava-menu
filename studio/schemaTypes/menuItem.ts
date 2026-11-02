import {defineField,defineType} from 'sanity';
export const menuItem = defineType({name:'menuItem',title:'Menu Items',type:'document',fields:[
 defineField({name:'nameEn',title:'Product Name (English)',type:'string',validation:r=>r.required()}),
 defineField({name:'nameRo',title:'Product Name (Romanian)',type:'string'}),
 defineField({name:'descriptionEn',title:'Description (English)',type:'text'}),
 defineField({name:'descriptionRo',title:'Description (Romanian)',type:'text'}),
 defineField({name:'category',title:'Category',type:'reference',to:[{type:'menuCategory'}],validation:r=>r.required()}),
 defineField({name:'price',title:'Price (lei)',type:'number'}),
 defineField({name:'size',title:'Size / Serving',type:'string'}),
 defineField({name:'prices',title:'Multiple Sizes and Prices',type:'array',of:[{type:'object',fields:[{name:'label',title:'Size / Label',type:'string'},{name:'amount',title:'Price (lei)',type:'number'}],preview:{select:{title:'label',subtitle:'amount'}}}]}),
 defineField({name:'image',title:'Product Image (optional)',type:'image',options:{hotspot:true}}),
 defineField({name:'legacyImagePath',title:'Original Website Image Path',type:'string',readOnly:true,description:'Used later when connecting existing food images'}),
 defineField({name:'order',title:'Display Order',type:'number',initialValue:0}),
 defineField({name:'visible',title:'Show on Website',type:'boolean',initialValue:true}),
],preview:{select:{title:'nameEn',subtitle:'category.nameEn',media:'image'}}});

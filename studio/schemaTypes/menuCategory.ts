import {defineField,defineType} from 'sanity';
export default defineType({name:'menuCategory',title:'Menu Categories',type:'document',fields:[
 defineField({name:'nameEn',title:'Category Name (English)',type:'string',validation:r=>r.required()}),
 defineField({name:'nameRo',title:'Category Name (Romanian)',type:'string'}),
 defineField({name:'section',title:'Menu Section',type:'reference',to:[{type:'menuSection'}],validation:r=>r.required()}),
 defineField({name:'parentCategory',title:'Parent Category (optional)',type:'reference',to:[{type:'menuCategory'}]}),
 defineField({name:'note',title:'Category Note (English)',type:'text'}),
 defineField({name:'noteRo',title:'Category Note (Romanian)',type:'text'}),
 defineField({name:'order',title:'Display Order',type:'number',initialValue:0}),
 defineField({name:'visible',title:'Show on Website',type:'boolean',initialValue:true}),
],preview:{select:{title:'nameEn',subtitle:'nameRo'}}});

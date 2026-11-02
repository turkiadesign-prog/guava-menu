import {defineField,defineType} from 'sanity';
export default defineType({name:'menuSection',title:'Menu Sections',type:'document',fields:[
 defineField({name:'name',title:'Section Name',type:'string',validation:r=>r.required()}),
 defineField({name:'slug',title:'Section ID',type:'slug',options:{source:'name'},validation:r=>r.required()}),
 defineField({name:'order',title:'Display Order',type:'number',initialValue:0}),
 defineField({name:'visible',title:'Show on Website',type:'boolean',initialValue:true}),
]});

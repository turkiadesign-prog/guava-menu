import {createClient} from '@sanity/client';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.join(here, 'guava-menu-data.json'), 'utf8'));
const token = process.env.SANITY_API_TOKEN;
if (!token) { console.error('Missing SANITY_API_TOKEN. Set it in your terminal before importing.'); process.exit(1); }
const client = createClient({projectId:'9tcimamh',dataset:'production',apiVersion:'2025-02-19',token,useCdn:false});
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const groupNames = {food:'Food',shisha:'Shisha',drinks:'Drinks'};
const docs = [];
for (const [group, categories] of Object.entries(data)) {
  const sid = `guava-section-${group}`;
  docs.push({_id:sid,_type:'menuSection',name:groupNames[group]||group,slug:{_type:'slug',current:group},order:['food','shisha','drinks'].indexOf(group),visible:true});
  for (const [ci,cat] of categories.entries()) {
    const cid = `guava-category-${group}-${slug(cat.key)}`;
    docs.push({_id:cid,_type:'menuCategory',nameEn:cat.en,nameRo:cat.ro||'',section:{_type:'reference',_ref:sid},order:ci,visible:true,...(cat.note?{note:cat.note}:{}),...(cat.noteRo?{noteRo:cat.noteRo}:{})});
    for (const [ii,item] of cat.items.entries()) {
      const iid = `guava-item-${group}-${slug(cat.key)}-${ii+1}`;
      const doc = {_id:iid,_type:'menuItem',nameEn:item.name,nameRo:'',descriptionEn:item.desc||'',descriptionRo:item.descRo||'',category:{_type:'reference',_ref:cid},order:ii,visible:true};
      if (typeof item.price==='number') doc.price=item.price;
      if (item.size) doc.size=item.size;
      if (item.prices) doc.prices=item.prices.map((p,n)=>({_key:`p${n+1}`,_type:'object',label:String(p[0]),amount:Number(p[1])}));
      if (group==='food' && !['Grilled goat cheese','Mixed pickles'].includes(item.name)) doc.legacyImagePath=`./assets/guava/menu/${slug(item.name)}.webp`;
      docs.push(doc);
    }
  }
}
console.log(`Ready to import ${docs.length} documents (3 sections, 42 categories, 321 products).`);
console.log('Existing unrelated Sanity documents will not be deleted.');
for (let i=0;i<docs.length;i+=100) {
 const batch=docs.slice(i,i+100);
 const tx=client.transaction();
 for (const doc of batch) tx.createOrReplace(doc);
 await tx.commit();
 console.log(`Imported ${Math.min(i+100,docs.length)}/${docs.length}`);
}
console.log('Finished. Refresh Sanity Studio. Website is not changed yet.');

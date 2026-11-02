/* Guava Sanity read-only menu adapter. No API token is used. */
(function () {
  const PROJECT = '9tcimamh';
  const DATASET = 'production';
  const QUERY = `{
    "categories": *[_type == "menuCategory" && visible != false] | order(order asc) {
      _id, nameEn, nameRo, note, noteRo, order,
      "sectionId": section._ref,
      "parentId": parentCategory._ref
    },
    "items": *[_type == "menuItem" && visible != false] | order(order asc) {
      _id, nameEn, nameRo, descriptionEn, descriptionRo,
      category, price, size, prices, order,
      "imageUrl": image.asset->url
    }
  }`;
  const endpoint = `https://${PROJECT}.api.sanity.io/v2025-02-19/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`;
  const groups = ['food', 'drinks', 'shisha'];
  const slug = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sort = (a,b) => (a.order ?? 99999) - (b.order ?? 99999);

  window.loadGuavaSanityMenu = async function (fallback) {
    try {
      const response = await fetch(endpoint, {cache: 'no-store'});
      if (!response.ok) throw new Error(`Sanity returned ${response.status}`);
      const {result} = await response.json();
      if (!result || !Array.isArray(result.categories) || !Array.isArray(result.items)) throw new Error('Invalid Sanity response');
      const menu = {food: [], drinks: [], shisha: []};
      const categories = result.categories;
      const items = result.items;
      for (const group of groups) {
        const sectionId = `guava-section-${group}`;
        const groupCategories = categories.filter(c => c.sectionId === sectionId).sort(sort);
        for (const cat of groupCategories) {
          const prefix = `guava-category-${group}-`;
          const key = cat._id.startsWith(prefix) ? cat._id.slice(prefix.length) : slug(cat.nameEn);
          const originalCat = (fallback[group] || []).find(c => c.key === key);
          const productList = items.filter(it => it.category?._ref === cat._id).sort(sort).map(it => {
            const original = originalCat?.items?.find(old => old.name === it.nameEn);
            const product = {
              name: it.nameEn || original?.name || '',
              ...(it.nameRo ? {nameRo: it.nameRo} : {}),
              desc: it.descriptionEn || '',
              descRo: it.descriptionRo || original?.descRo || '',
              ...(it.price != null ? {price: it.price} : {}),
              ...(it.size ? {size: it.size} : {}),
              ...(Array.isArray(it.prices) && it.prices.length ? {prices: it.prices.map(p => [p.label, p.amount])} : {}),
              ...(it.imageUrl ? {imageUrl: it.imageUrl} : {})
            };
            return product;
          });
          menu[group].push({
            key, en: cat.nameEn || originalCat?.en || '', ro: cat.nameRo || originalCat?.ro || '',
            note: cat.note || '', noteRo: cat.noteRo || '', items: productList
          });
        }
      }
      if (!categories.length) throw new Error('No published categories found');
      console.info('Guava menu loaded from Sanity');
      return menu;
    } catch (error) {
      console.warn('Sanity unavailable; using original Guava menu.', error);
      return fallback;
    }
  };
})();

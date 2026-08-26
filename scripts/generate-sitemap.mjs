import { readFile, writeFile } from 'node:fs/promises';

const origin = 'https://babushkina-kladovaya.nadiiahonda34.workers.dev';
const recipes = JSON.parse(await readFile(new URL('../recipes-ru.json', import.meta.url), 'utf8'));
const staticPaths = ['/', '/about.html', '/contact.html', '/privacy.html', '/terms.html', '/editorial-policy.html'];
const recipePaths = recipes.map((recipe) => `/ru/recipes/recipe-${Number(recipe.id)}/`);
const urls = [...staticPaths, ...recipePaths];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}\n</urlset>\n`;

await writeFile(new URL('../sitemap.xml', import.meta.url), xml);
console.log(`Generated ${urls.length} sitemap URLs`);

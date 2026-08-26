import { readFile } from 'node:fs/promises';

const files = ['index.html', 'live.js', 'worker.js', 'recipes-ru.json', 'robots.txt', 'sitemap.xml'];
const contents = Object.fromEntries(await Promise.all(files.map(async (file) => [file, await readFile(new URL(`../${file}`, import.meta.url), 'utf8')])));
const recipes = JSON.parse(contents['recipes-ru.json']);
const checks = [
  ['recipe data is substantial', Array.isArray(recipes) && recipes.length >= 200],
  ['index has canonical URL', /rel="canonical"/.test(contents['index.html'])],
  ['index has description', /name="description"/.test(contents['index.html'])],
  ['recipe dialog is native', /<dialog id="modal"/.test(contents['index.html'])],
  ['sitemap has every recipe', recipes.every((recipe) => contents['sitemap.xml'].includes(`/recipe-${recipe.id}/`))],
  ['robots references sitemap', /Sitemap:\s*https:\/\//.test(contents['robots.txt'])],
  ['forum submissions require moderation', /forum_posts[\s\S]*?'pending'/.test(contents['worker.js'])]
];
const failures = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failures.length) {
  console.error(`Validation failed: ${failures.join(', ')}`);
  process.exit(1);
}
console.log(`Validated ${checks.length} release checks and ${recipes.length} recipes`);

const SITE_URL = 'https://babushkina-kladovaya.nadiiahonda34.workers.dev';
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const clean = (value, length = 5000) => String(value ?? '').trim().slice(0, length);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

function withSecurityHeaders(response) {
  const secured = new Response(response.body, response);
  secured.headers.set('x-content-type-options', 'nosniff');
  secured.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  secured.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()');
  secured.headers.set('x-frame-options', 'SAMEORIGIN');
  return secured;
}

async function loadRussianRecipes(env, requestUrl) {
  const dataUrl = new URL('/recipes-ru.json', requestUrl);
  const response = await env.ASSETS.fetch(new Request(dataUrl));
  if (!response.ok) throw new Error('recipes_unavailable');
  return response.json();
}

function recipePage(recipe, canonicalPath) {
  const title = escapeHtml(recipe.title);
  const category = escapeHtml(recipe.cat);
  const minutes = Number(recipe.time) || 30;
  const canonical = `${SITE_URL}${canonicalPath}`;
  const ingredients = (recipe.ingredients || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const steps = (recipe.steps || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Recipe', name: recipe.title, recipeCategory: recipe.cat, totalTime: `PT${minutes}M`, recipeIngredient: recipe.ingredients || [], recipeInstructions: (recipe.steps || []).map((text) => ({ '@type': 'HowToStep', text })), inLanguage: 'ru' }).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — Бабушкина кладовая</title><meta name="description" content="${title}: ингредиенты и пошаговое приготовление. Время — ${minutes} минут."><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${title} — Бабушкина кладовая"><meta property="og:description" content="Ингредиенты и пошаговое приготовление. Время — ${minutes} минут."><meta property="og:url" content="${canonical}"><link rel="stylesheet" href="/live.css"><link rel="stylesheet" href="/fixes.css"><script type="application/ld+json">${schema}</script></head><body><header class="header"><a class="logo" href="/"><span>БК</span><b>Бабушкина кладовая</b></a><nav><a href="/#recipes">Все рецепты</a><a href="/about.html">О проекте</a><a href="/contact.html">Контакты</a></nav></header><main><article class="split" style="display:block;max-width:820px;margin:40px auto"><span>${category}</span><h1 style="font:700 clamp(38px,6vw,62px) Georgia;margin:14px 0">${escapeHtml(recipe.emoji || '🍽️')} ${title}</h1><p>Время приготовления: ${minutes} минут</p><h2>Ингредиенты</h2><ul>${ingredients}</ul><h2>Приготовление</h2><ol>${steps}</ol><div class="recipe-actions"><button type="button" onclick="window.print()">Сохранить / PDF</button><a href="/#recipes">Другие рецепты</a></div></article></main><footer><b>Бабушкина кладовая</b><span>© 2026</span><div><a href="/privacy.html">Конфиденциальность</a><a href="/terms.html">Правила</a></div></footer></body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/api/health') {
        try { await env.DB.prepare('SELECT 1').first(); return withSecurityHeaders(json({ ok: true, database: 'connected' })); }
        catch { return withSecurityHeaders(json({ ok: false, error: 'database_unavailable' }, 503)); }
      }

      if (url.pathname === '/api/recipes' && request.method === 'POST') {
        let body; try { body = await request.json(); } catch { return withSecurityHeaders(json({ ok: false, error: 'invalid_json' }, 400)); }
        if (clean(body.website, 200)) return withSecurityHeaders(json({ ok: true, status: 'pending' }, 202));
        const title = clean(body.title, 160), description = clean(body.description, 3000), category = clean(body.category, 100), author = clean(body.author, 120), ingredients = clean(body.ingredients, 8000), steps = clean(body.steps, 12000);
        if (!title || !description || !ingredients || !steps) return withSecurityHeaders(json({ ok: false, error: 'required_fields' }, 400));
        const id = crypto.randomUUID();
        await env.DB.prepare(`INSERT INTO recipe_submissions (id,author,title,description,category,ingredients,steps,status,created_at) VALUES (?,?,?,?,?,?,?,'pending',datetime('now'))`).bind(id, author, title, description, category, ingredients, steps).run();
        return withSecurityHeaders(json({ ok: true, id, status: 'pending' }, 201));
      }

      if (url.pathname === '/api/forum' && request.method === 'GET') {
        const result = await env.DB.prepare(`SELECT id,name,title,body,created_at FROM forum_posts WHERE status='published' ORDER BY created_at DESC LIMIT 50`).all();
        return withSecurityHeaders(json({ ok: true, posts: result.results || [] }));
      }

      if (url.pathname === '/api/forum' && request.method === 'POST') {
        let body; try { body = await request.json(); } catch { return withSecurityHeaders(json({ ok: false, error: 'invalid_json' }, 400)); }
        if (clean(body.website, 200)) return withSecurityHeaders(json({ ok: true, status: 'pending' }, 202));
        const name = clean(body.name, 120), title = clean(body.title, 180), text = clean(body.body, 6000);
        if (!title || !text) return withSecurityHeaders(json({ ok: false, error: 'required_fields' }, 400));
        const id = crypto.randomUUID();
        await env.DB.prepare(`INSERT INTO forum_posts (id,name,title,body,status,created_at) VALUES (?,?,?,?,'pending',datetime('now'))`).bind(id, name || 'Гость', title, text).run();
        return withSecurityHeaders(json({ ok: true, id, status: 'pending' }, 201));
      }

      const recipeMatch = url.pathname.match(/^\/ru\/recipes\/recipe-(\d+)(?:\/index\.html|\/)?$/);
      if (recipeMatch && (request.method === 'GET' || request.method === 'HEAD')) {
        const recipes = await loadRussianRecipes(env, url);
        const recipe = recipes.find((item) => Number(item.id) === Number(recipeMatch[1]));
        if (!recipe) return withSecurityHeaders(new Response('Рецепт не найден', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } }));
        const canonicalPath = `/ru/recipes/recipe-${recipe.id}/`;
        if (url.pathname !== canonicalPath) return Response.redirect(`${SITE_URL}${canonicalPath}`, 301);
        return withSecurityHeaders(new Response(request.method === 'HEAD' ? null : recipePage(recipe, canonicalPath), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=3600' } }));
      }

      return withSecurityHeaders(await env.ASSETS.fetch(request));
    } catch {
      return withSecurityHeaders(new Response('Временная ошибка сервера', { status: 500, headers: { 'content-type': 'text/plain; charset=utf-8' } }));
    }
  }
};
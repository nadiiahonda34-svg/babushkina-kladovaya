const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const clean = (v, n=5000) => String(v ?? '').trim().slice(0,n);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      try { await env.DB.prepare('SELECT 1').first(); return json({ok:true, database:'connected'}); }
      catch (e) { return json({ok:false, error:'database_unavailable'}, 503); }
    }
    if (url.pathname === '/api/recipes' && request.method === 'POST') {
      let b; try { b = await request.json(); } catch { return json({ok:false,error:'invalid_json'},400); }
      const title=clean(b.title,160), description=clean(b.description,3000), category=clean(b.category,100), author=clean(b.author,120), ingredients=clean(b.ingredients,8000), steps=clean(b.steps,12000);
      if(!title || !description || !ingredients || !steps) return json({ok:false,error:'required_fields'},400);
      const id=crypto.randomUUID();
      await env.DB.prepare(`INSERT INTO recipe_submissions (id,author,title,description,category,ingredients,steps,status,created_at) VALUES (?,?,?,?,?,?,?,'pending',datetime('now'))`).bind(id,author,title,description,category,ingredients,steps).run();
      return json({ok:true,id,status:'pending'},201);
    }
    if (url.pathname === '/api/forum' && request.method === 'GET') {
      const r=await env.DB.prepare(`SELECT id,name,title,body,created_at FROM forum_posts WHERE status='published' ORDER BY created_at DESC LIMIT 50`).all();
      return json({ok:true,posts:r.results||[]});
    }
    if (url.pathname === '/api/forum' && request.method === 'POST') {
      let b; try { b=await request.json(); } catch { return json({ok:false,error:'invalid_json'},400); }
      const name=clean(b.name,120), title=clean(b.title,180), body=clean(b.body,6000);
      if(!title || !body) return json({ok:false,error:'required_fields'},400);
      const id=crypto.randomUUID();
      await env.DB.prepare(`INSERT INTO forum_posts (id,name,title,body,status,created_at) VALUES (?,?,?,?,'published',datetime('now'))`).bind(id,name||'Гость',title,body).run();
      return json({ok:true,id},201);
    }
    return env.ASSETS.fetch(request);
  }
};

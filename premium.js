const L=window.BK_LANG,U=window.BK_UI;let R=[],shown=12,cat="";
const PHOTO_POOLS={
 salad:[
"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82",
"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82",
"https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=82"],
 cake:[
"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=82",
"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=82",
"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=82"],
 bake:[
"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=82",
"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=82",
"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82"],
 hot:[
"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82",
"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=82",
"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=82"]
};
function recipePhoto(r){let s=norm((r.title||"")+" "+(r.cat||"")+" "+((r.tags||[]).join(" ")));let k=/салат|salad|ensalada|salade/.test(s)?"salad":/торт|cake|kuchen|pastel|gâteau|torte|чизкейк|cheesecake/.test(s)?"cake":/печень|cookie|biscuit|galleta|пирог|pie|чай|tea|tee|thé|dessert|десерт|выпеч/.test(s)?"bake":"hot";let a=PHOTO_POOLS[k];return a[Math.abs(Number(r.id)||0)%a.length]}
function dishIcon(r){let s=(r.title+" "+r.cat).toLowerCase();if(/торт|cake|kuchen|pastel|gâteau/.test(s))return "🍰";if(/салат|salad|ensalada|salade/.test(s))return "🥗";if(/печень|cookie|biscuit|galleta/.test(s))return "🍪";if(/чай|tea|tee|thé/.test(s))return "🫖";if(/суп|soup|suppe|sopa|soupe/.test(s))return "🍲";if(/рыб|salmon|fish|fisch|poisson/.test(s))return "🐟";if(/десерт|dessert/.test(s))return "🍮";return "🍽️"}
const $=s=>document.querySelector(s),norm=s=>(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ё/g,"е");
fetch(`/recipes-${L}.json`).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}).then(x=>{R=x;build();render()}).catch(()=>{$("#count").textContent=U.empty;$("#grid").innerHTML=`<p>${U.empty}</p>`});
function build(){let cs=[...new Set(R.map(r=>r.cat))].slice(0,12);$("#filters").innerHTML=`<button class="active" data-c="">${U.all}</button>`+cs.map(c=>`<button data-c="${c}">${c}</button>`).join("");$("#filters").querySelectorAll("button").forEach(b=>b.onclick=()=>{cat=b.dataset.c;shown=12;$("#filters").querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b));render()})}
function data(){let q=norm($("#q").value.trim());return R.filter(r=>(!cat||r.cat===cat)&&(!q||norm([r.title,r.cat,...(r.tags||[]),...(r.ingredients||[])].join(" ")).includes(q)))}
function render(){let a=data();$("#count").textContent=a.length?`${a.length} ${U.nav[0].toLowerCase()}`:U.empty;$("#grid").innerHTML=a.slice(0,shown).map(r=>`<a class="card" href="${r.url||"#"}" data-id="${r.id}"><div class="visual"><img src="${recipePhoto(r)}" data-fallback="${r.image||''}" onerror="if(this.dataset.fallback&&this.src!==this.dataset.fallback)this.src=this.dataset.fallback" alt="${r.title}" loading="lazy" width="900" height="620"></div><div class="cardBody"><small>${r.cat}</small><h3>${r.title}</h3><div class="meta"><span>${r.time||30} ${U.min}</span><span>↗</span></div></div></a>`).join("");$("#more").style.display=a.length>shown?"block":"none";}
function openR(id){let r=R.find(x=>x.id===id);$("#modalBody").innerHTML=`<small>${r.cat}</small><h2>${r.title}</h2><p>${r.time||30} ${U.min}</p><h3>${L==="ru"?"Ингредиенты":L==="uk"?"Інгредієнти":L==="de"?"Zutaten":L==="es"?"Ingredientes":L==="fr"?"Ingrédients":"Ingredients"}</h3><ul>${r.ingredients.map(x=>`<li>${x}</li>`).join("")}</ul><h3>${L==="ru"?"Приготовление":L==="uk"?"Приготування":L==="de"?"Zubereitung":L==="es"?"Preparación":L==="fr"?"Préparation":"Method"}</h3><ol>${r.steps.map(x=>`<li>${x}</li>`).join("")}</ol><button class="pdf" onclick="window.print()">PDF</button>`;$("#modal").showModal()}
$(".x").onclick=()=>$("#modal").close();$("#more").onclick=()=>{shown+=12;render()};$("#go").onclick=()=>{cat="";shown=12;render();$("#catalog").scrollIntoView({behavior:"smooth"})};let t;$("#q").oninput=()=>{clearTimeout(t);t=setTimeout(()=>{cat="";shown=12;render()},100)};$("#q").onkeydown=e=>{if(e.key==="Enter")$("#go").click()};document.querySelectorAll("[data-find]").forEach(b=>b.onclick=()=>{$("#q").value=b.dataset.find;cat="";shown=12;render();$("#catalog").scrollIntoView({behavior:"smooth"})});$("#lang").onchange=e=>location.href=`/${e.target.value}/`;
async function openTraditions(){
  try{
    const a=await fetch(`/traditions-${L}.json`).then(r=>r.json());
    const title=U.trad||"Family traditions";
    $("#modalBody").innerHTML=`<small>${title}</small><h2>${title}</h2><div class="articleList">${a.map(x=>`<article><b>${x.title}</b><span>${x.category||""}</span><p>${x.description}</p></article>`).join("")}</div>`;
    $("#modal").showModal();
  }catch(e){alert("Раздел временно недоступен");}
}
async function openDreambook(){
  try{
    const a=await fetch(`/dreambook-${L}.json`).then(r=>r.json());
    const title=U.dream||"Dreambook";
    $("#modalBody").innerHTML=`<small>${title}</small><h2>${title}</h2><p class="dreamNote">${L==="ru"?"Фольклорные толкования — культурная традиция, а не предсказания.":""}</p><input class="dreamSearch" id="dreamQ" placeholder="${L==="ru"?"Найти образ сна…":"Search…"}"><div class="articleList" id="dreamList"></div>`;
    const box=$("#dreamList"), inp=$("#dreamQ");
    const draw=()=>{let q=norm(inp.value);let rows=a.filter(x=>!q||norm(x.term+" "+x.meaning).includes(q)).slice(0,80);box.innerHTML=rows.map(x=>`<article><b>${x.term}</b><p>${x.meaning}</p></article>`).join("")};
    inp.oninput=draw; draw(); $("#modal").showModal();
  }catch(e){alert("Раздел временно недоступен");}
}
document.querySelector("#trad a")?.addEventListener("click",e=>{e.preventDefault();openTraditions()});
document.querySelector("#dream a")?.addEventListener("click",e=>{e.preventDefault();openDreambook()});

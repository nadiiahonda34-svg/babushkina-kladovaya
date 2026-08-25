
let recipes=[],dreams=[],traditions=[];
Promise.all([fetch("recipes.json").then(r=>r.json()),fetch("dreambook.json").then(r=>r.json()),fetch("traditions.json").then(r=>r.json())]).then(([a,b,c])=>{recipes=a;dreams=b;traditions=c;renderFeatured()});

const T={
ru:{brand:"Бабушкина кладовая",tagline:"семейные рецепты и традиции",recipes:"Рецепты",dreams:"Сонник",traditions:"Традиции",useful:"Полезное",add:"+ Рецепт",pill:"Домашняя коллекция",hero:"Рецепты, которые хочется сохранить.",heroSub:"100 семейных идей, народный сонник и традиции — в одном аккуратном месте.",search:"Найти рецепт, сон или традицию",find:"Найти",soups:"Супы",baking:"Выпечка",today:"Идея дня",safe:"Безопасные советы",popular:"ПОПУЛЯРНОЕ",startHere:"Начните отсюда",allRecipes:"Все рецепты →",addRecipe:"Добавить рецепт",moderation:"После подключения базы рецепты будут отправляться на модерацию.",send:"Отправить",footer:"Семейная коллекция рецептов и традиций"},
en:{brand:"Grandma's Pantry",tagline:"family recipes & traditions",recipes:"Recipes",dreams:"Dreambook",traditions:"Traditions",useful:"Useful",add:"+ Recipe",pill:"Family collection",hero:"Recipes worth keeping.",heroSub:"220 family ideas, a folklore dreambook and traditions — all in one tidy place.",search:"Find a recipe, dream or tradition",find:"Search",soups:"Soups",baking:"Baking",today:"Today's idea",safe:"Safe tips",popular:"POPULAR",startHere:"Start here",allRecipes:"All recipes →",addRecipe:"Add recipe",moderation:"Recipes will be sent for moderation after the database is connected.",send:"Send",footer:"A family collection of recipes and traditions"},
de:{brand:"Omas Vorratskammer",tagline:"Familienrezepte & Traditionen",recipes:"Rezepte",dreams:"Traumbuch",traditions:"Traditionen",useful:"Ratgeber",add:"+ Rezept",pill:"Familiensammlung",hero:"Rezepte, die man bewahren möchte.",heroSub:"220 Familienideen, Traumbuch und Traditionen an einem Ort.",search:"Rezept, Traum oder Tradition suchen",find:"Suchen",soups:"Suppen",baking:"Backen",today:"Idee des Tages",safe:"Sichere Tipps",popular:"BELIEBT",startHere:"Hier starten",allRecipes:"Alle Rezepte →",addRecipe:"Rezept hinzufügen",moderation:"Nach Anschluss der Datenbank werden Rezepte moderiert.",send:"Senden",footer:"Familienrezepte und Traditionen"},
es:{brand:"La despensa de la abuela",tagline:"recetas y tradiciones familiares",recipes:"Recetas",dreams:"Sueños",traditions:"Tradiciones",useful:"Consejos",add:"+ Receta",pill:"Colección familiar",hero:"Recetas que vale la pena guardar.",heroSub:"220 ideas familiares, sueños y tradiciones en un solo lugar.",search:"Buscar receta, sueño o tradición",find:"Buscar",soups:"Sopas",baking:"Repostería",today:"Idea del día",safe:"Consejos seguros",popular:"POPULAR",startHere:"Empieza aquí",allRecipes:"Todas las recetas →",addRecipe:"Añadir receta",moderation:"Las recetas pasarán a moderación cuando conectemos la base de datos.",send:"Enviar",footer:"Recetas y tradiciones familiares"},
fr:{brand:"Le garde-manger de Mamie",tagline:"recettes et traditions familiales",recipes:"Recettes",dreams:"Rêves",traditions:"Traditions",useful:"Conseils",add:"+ Recette",pill:"Collection familiale",hero:"Des recettes à conserver.",heroSub:"220 idées familiales, un livre des rêves et des traditions réunis.",search:"Chercher recette, rêve ou tradition",find:"Chercher",soups:"Soupes",baking:"Pâtisserie",today:"Idée du jour",safe:"Conseils sûrs",popular:"POPULAIRE",startHere:"Commencez ici",allRecipes:"Toutes les recettes →",addRecipe:"Ajouter une recette",moderation:"Les recettes seront modérées après connexion de la base.",send:"Envoyer",footer:"Recettes et traditions familiales"},
uk:{brand:"Бабусина комора",tagline:"сімейні рецепти й традиції",recipes:"Рецепти",dreams:"Сонник",traditions:"Традиції",useful:"Корисне",add:"+ Рецепт",pill:"Сімейна колекція",hero:"Рецепти, які хочеться зберегти.",heroSub:"220 сімейних ідей, народний сонник і традиції в одному місці.",search:"Знайти рецепт, сон або традицію",find:"Знайти",soups:"Супи",baking:"Випічка",today:"Ідея дня",safe:"Безпечні поради",popular:"ПОПУЛЯРНЕ",startHere:"Почніть звідси",allRecipes:"Усі рецепти →",addRecipe:"Додати рецепт",moderation:"Після підключення бази рецепти надсилатимуться на модерацію.",send:"Надіслати",footer:"Сімейна колекція рецептів і традицій"}
};
const fallback=T.en;
function applyLang(lang){
 const t=T[lang]||fallback;
 document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr";
 document.querySelectorAll("[data-i18n]").forEach(el=>{let k=el.dataset.i18n;if(t[k])el.textContent=t[k]});
 document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{let k=el.dataset.i18nPlaceholder;if(t[k])el.placeholder=t[k]});
 localStorage.setItem("bk-lang",lang);
}
const sel=document.querySelector("#languageSelect");sel.value=localStorage.getItem("bk-lang")||"ru";applyLang(sel.value);sel.addEventListener("change",e=>applyLang(e.target.value));

const norm=s=>(s||"").toLowerCase().replace(/ё/g,"е");
function renderFeatured(){
 document.querySelector("#featuredGrid").innerHTML=recipes.slice(0,4).map(card).join("");
 bindRecipeCards();
}
function card(r){return `<button class="card" data-recipe="${r.id}"><div class="cardVisual">${r.emoji||"🍲"}</div><div class="cardBody"><small>${r.cat}</small><h3>${r.title}</h3><p>${r.time||30} мин · открыть рецепт →</p></div></button>`}
function bindRecipeCards(){document.querySelectorAll("[data-recipe]").forEach(x=>x.onclick=()=>openRecipe(+x.dataset.recipe))}
function openRecipe(id){
 const r=recipes.find(x=>x.id===id); if(!r)return;
 document.querySelector("#recipeBody").innerHTML=`<small>${r.cat}</small><h2>${r.emoji||"🍲"} ${r.title}</h2><p>${r.time||30} мин</p><h3>Ингредиенты</h3><ul>${(r.ingredients||[]).map(x=>`<li>${x}</li>`).join("")}</ul><h3>Приготовление</h3><ol>${(r.steps||[]).map(x=>`<li>${x}</li>`).join("")}</ol><button class="print" onclick="window.print()">PDF / Печать</button>`;
 document.querySelector("#recipeModal").classList.remove("hidden")
}
document.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>x.closest(".modal").classList.add("hidden"));
document.querySelector("#openAdd").onclick=()=>document.querySelector("#addModal").classList.remove("hidden");
document.querySelector("#demoSubmit").onclick=()=>document.querySelector("#submitNote").textContent="Демо-форма: для реальной отправки подключим базу и модерацию.";

function openView(type,q=""){
 const ws=document.querySelector("#workspace");ws.classList.remove("hidden");
 let title="",desc="",kicker="",tools="",content="";
 if(type==="recipes"){
  kicker="КАТАЛОГ";title="Все рецепты";desc="Быстрый каталог без длинной ленты.";
  tools=`<div class="tools"><input id="viewSearch" placeholder="Суп, яблоко, капуста…"><button id="viewSearchBtn">Найти</button></div>`;
  const list=filterRecipes(q);content=`<div class="grid" id="resultGrid">${list.slice(0,24).map(card).join("")}</div>`;
 } else if(type==="dreams"){
  kicker="БАБУШКИН СОННИК";title="Народные толкования";desc="Фольклор и семейная традиция — не предсказания.";
  tools=`<div class="tools"><input id="viewSearch" placeholder="Например: вода, дом, дорога"><button id="viewSearchBtn">Толковать</button></div>`;
  const list=q?dreams.filter(x=>norm(x.term+" "+x.meaning).includes(norm(q))):dreams.slice(0,18);
  content=`<div class="grid" id="resultGrid">${list.slice(0,30).map(x=>`<article class="result"><small>СОННИК</small><h3>${x.term}</h3><p>${x.meaning}</p></article>`).join("")}</div>`;
 } else if(type==="traditions"){
  kicker="СЕМЕЙНЫЙ СПРАВОЧНИК";title="Традиции";desc="Короткие идеи для дома, кухни, сезонов и семейной памяти.";
  tools=`<div class="tools"><input id="viewSearch" placeholder="Например: фотографии, праздник"><button id="viewSearchBtn">Найти</button></div>`;
  const list=q?traditions.filter(x=>norm(x.title+" "+x.description+" "+x.category).includes(norm(q))):traditions.slice(0,18);
  content=`<div class="grid" id="resultGrid">${list.slice(0,30).map(x=>`<article class="result"><small>${x.category}</small><h3>${x.title}</h3><p>${x.description}</p></article>`).join("")}</div>`;
 } else {
  kicker="БЕРЕЖНЫЙ БЫТ";title="Полезное";desc="Короткие безопасные рекомендации без сомнительных лечебных обещаний.";
  content=`<div class="grid"><article class="result"><small>ПИТАНИЕ</small><h3>Разнообразие важнее запретов</h3><p>Сочетайте овощи, крупы, источники белка и привычные семейные блюда.</p></article><article class="result"><small>КУХНЯ</small><h3>Чистота и хранение</h3><p>Разделяйте сырые и готовые продукты, соблюдайте сроки и температурный режим.</p></article><article class="result"><small>ТРАВЫ</small><h3>Только известные пищевые растения</h3><p>Не используйте неизвестные дикорастущие растения. Травы могут взаимодействовать с лекарствами.</p></article></div>`;
 }
 document.querySelector("#viewKicker").textContent=kicker;document.querySelector("#viewTitle").textContent=title;document.querySelector("#viewDescription").textContent=desc;document.querySelector("#viewTools").innerHTML=tools;document.querySelector("#viewContent").innerHTML=content;
 bindRecipeCards();
 const b=document.querySelector("#viewSearchBtn");if(b)b.onclick=()=>openView(type,document.querySelector("#viewSearch").value);
 const inp=document.querySelector("#viewSearch");if(inp)inp.addEventListener("keydown",e=>{if(e.key==="Enter")openView(type,inp.value)});
 ws.scrollIntoView({behavior:"smooth",block:"start"});
}
function filterRecipes(q){if(!q)return recipes;let n=norm(q);return recipes.filter(r=>norm([r.title,r.cat,...(r.tags||[]),...(r.ingredients||[])].join(" ")).includes(n))}
document.querySelectorAll("[data-view]").forEach(x=>x.onclick=()=>openView(x.dataset.view));
document.querySelector("#closeWorkspace").onclick=()=>document.querySelector("#workspace").classList.add("hidden");
function globalGo(){
 const q=document.querySelector("#globalSearch").value.trim(); if(!q)return openView("recipes");
 let rr=filterRecipes(q); if(rr.length)return openView("recipes",q);
 if(dreams.some(x=>norm(x.term+" "+x.meaning).includes(norm(q))))return openView("dreams",q);
 return openView("traditions",q);
}
document.querySelector("#globalSearchBtn").onclick=globalGo;document.querySelector("#globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter")globalGo()});
document.querySelectorAll("[data-q]").forEach(x=>x.onclick=()=>{document.querySelector("#globalSearch").value=x.dataset.q;openView("recipes",x.dataset.q)});
document.querySelector("#menuBtn").onclick=()=>openView("recipes");

// UX enhancement: instant global search with a short debounce.
let instantTimer;
const globalInput=document.querySelector("#globalSearch");
globalInput.addEventListener("input",()=>{
 clearTimeout(instantTimer);
 const q=globalInput.value.trim();
 if(q.length<2)return;
 instantTimer=setTimeout(()=>{
   const rr=filterRecipes(q);
   if(rr.length){
     const ws=document.querySelector("#workspace"); ws.classList.remove("hidden");
     document.querySelector("#viewKicker").textContent="БЫСТРЫЙ ПОИСК";
     document.querySelector("#viewTitle").textContent=`Найдено рецептов: ${rr.length}`;
     document.querySelector("#viewDescription").textContent="Результаты обновляются по мере ввода.";
     document.querySelector("#viewTools").innerHTML="";
     document.querySelector("#viewContent").innerHTML=`<div class="grid">${rr.slice(0,30).map(card).join("")}</div>`;
     bindRecipeCards();
   }
 },120);
});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"){
  document.querySelectorAll(".modal").forEach(x=>x.classList.add("hidden"));
  document.querySelector("#workspace").classList.add("hidden");
 }
});

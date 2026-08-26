(() => {
  'use strict';
  let recipes = [], shown = 16, currentCategory = '', lastFocusedCard = null;
  const $ = (selector) => document.querySelector(selector);
  const normalize = (value) => String(value || '').toLowerCase().replace(/ё/g, 'е');
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const priority = ['Праздничные салаты','Новогодние салаты','Салаты на день рождения','Особенные салаты','Торты','Печенье','Новогодняя выпечка','Десерты','Выпечка','Горячие блюда','Рыба','Завтраки','Суп'];

  function buildTabs() {
    const categories = [...new Set(recipes.map((recipe) => recipe.cat).filter(Boolean))];
    categories.sort((a, b) => { const ai = priority.indexOf(a), bi = priority.indexOf(b); return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.localeCompare(b, 'ru'); });
    $('#tabs').innerHTML = `<button class="${currentCategory ? '' : 'active'}" type="button" data-category="">Все</button>` + categories.map((category) => `<button class="${currentCategory === category ? 'active' : ''}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
    $('#tabs').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => { currentCategory = button.dataset.category || ''; shown = 16; buildTabs(); render(); }));
  }

  function filteredRecipes() {
    const query = normalize($('#q').value.trim());
    return recipes.filter((recipe) => (!currentCategory || recipe.cat === currentCategory) && (!query || normalize([recipe.title, recipe.cat, ...(recipe.tags || []), ...(recipe.ingredients || [])].join(' ')).includes(query)));
  }

  function render() {
    const filtered = filteredRecipes();
    $('#status').textContent = filtered.length ? `Найдено рецептов: ${filtered.length}` : 'Ничего не найдено. Попробуйте другой запрос.';
    $('#grid').innerHTML = filtered.slice(0, shown).map((recipe) => `<a class="card" data-id="${Number(recipe.id)}" href="${escapeHtml(recipe.url || `/ru/recipes/recipe-${recipe.id}/index.html`)}"><div class="visual" aria-hidden="true">${escapeHtml(recipe.emoji || '🍽️')}</div><div class="body"><small>${escapeHtml(recipe.cat)}</small><h3>${escapeHtml(recipe.title)}</h3><p>${Number(recipe.time) || 30} мин · открыть рецепт →</p></div></a>`).join('');
    $('#more').hidden = filtered.length <= shown;
    $('#reset').hidden = !currentCategory && !$('#q').value.trim();
    $('#grid').querySelectorAll('.card').forEach((card) => card.addEventListener('click', (event) => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); lastFocusedCard = card; openRecipe(Number(card.dataset.id)); }));
  }

  function openRecipe(id) {
    const recipe = recipes.find((item) => Number(item.id) === id);
    if (!recipe) return;
    const recipeUrl = recipe.url || `/ru/recipes/recipe-${recipe.id}/index.html`;
    $('#modalBody').innerHTML = `<small>${escapeHtml(recipe.cat)}</small><h2 id="recipeTitle">${escapeHtml(recipe.emoji || '🍽️')} ${escapeHtml(recipe.title)}</h2><p>${Number(recipe.time) || 30} минут</p><h3>Ингредиенты</h3><ul>${(recipe.ingredients || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><h3>Приготовление</h3><ol>${(recipe.steps || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol><div class="recipe-actions"><a href="${escapeHtml(recipeUrl)}">Открыть отдельной страницей</a><button type="button" id="printRecipe">Сохранить / PDF</button></div>`;
    $('#printRecipe').addEventListener('click', () => window.print());
    $('#modal').showModal();
  }

  function resetFilters() {
    currentCategory = ''; $('#q').value = ''; shown = 16;
    const url = new URL(location.href); url.searchParams.delete('q'); history.replaceState({}, '', url);
    buildTabs(); render();
  }

  $('.close').addEventListener('click', () => $('#modal').close());
  $('#modal').addEventListener('click', (event) => { if (event.target === $('#modal')) $('#modal').close(); });
  $('#modal').addEventListener('close', () => lastFocusedCard?.focus());
  $('#more').addEventListener('click', () => { shown += 16; render(); });
  $('#reset').addEventListener('click', resetFilters);
  let debounce;
  $('#q').addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { currentCategory = ''; shown = 16; buildTabs(); render(); }, 120); });
  const initialQuery = new URL(location.href).searchParams.get('q');
  if (initialQuery) $('#q').value = initialQuery;
  fetch('/recipes-ru.json')
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then((data) => { recipes = Array.isArray(data) ? data : []; buildTabs(); render(); })
    .catch(() => { $('#status').className = 'error'; $('#status').textContent = 'Не удалось загрузить рецепты. Обновите страницу немного позже.'; $('#more').hidden = true; });
})();

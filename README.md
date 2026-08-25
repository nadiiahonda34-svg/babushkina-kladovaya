# Бабушкина кладовая — Launch Kit

В комплекте:
- рабочий адаптивный front-end прототип;
- поиск, каталог, карточки, форма пользовательского рецепта;
- сохранение рецепта в PDF через печать;
- `database.sql` — production-модель PostgreSQL/Supabase;
- `robots.txt` и стартовый `sitemap.xml`;
- шаблоны About / Privacy / Terms;
- `LAUNCH_PLAN.md` — последовательность реального запуска.

Важно: это launch-kit, а не уже подключённый сервер. Регистрация, реальные отзывы, модерация, БД, хранение фото и рекламные аккаунты требуют инфраструктуры и ваших внешних аккаунтов.

## Cloudflare D1 community backend
This package now includes a real Worker backend (`worker.js`) and the Cloudflare D1 schema (`schema-d1.sql`).
For this deployment, use `schema-d1.sql`; `database-postgres-reference.sql` is only an older PostgreSQL/Supabase reference model.
See `DEPLOY-CLOUDFLARE-D1.txt` for the exact deployment and health-check sequence.

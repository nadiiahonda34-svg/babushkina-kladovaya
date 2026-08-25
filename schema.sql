PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS recipe_submissions (
 id TEXT PRIMARY KEY,
 author TEXT NOT NULL DEFAULT '',
 title TEXT NOT NULL,
 description TEXT NOT NULL,
 category TEXT NOT NULL DEFAULT '',
 ingredients TEXT NOT NULL,
 steps TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','published','rejected')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS recipe_submissions_status_created ON recipe_submissions(status,created_at DESC);
CREATE TABLE IF NOT EXISTS forum_posts (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL DEFAULT 'Гость',
 title TEXT NOT NULL,
 body TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('pending','published','rejected')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS forum_posts_status_created ON forum_posts(status,created_at DESC);

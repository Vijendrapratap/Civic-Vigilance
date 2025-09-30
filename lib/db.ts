import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export function getDB() {
  if (!db) db = SQLite.openDatabaseSync?.('civicvigilance.db') || (SQLite as any).openDatabase('civicvigilance.db');
  return db!;
}

export function ensureSchema() {
  const db = getDB();
  db.withTransactionSync?.(() => {
    db.execSync?.(`PRAGMA foreign_keys = ON;`);
    // users & profiles
    db.execSync?.(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );`);
    db.execSync?.(`CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      full_name TEXT,
      avatar_url TEXT,
      created_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );`);
    // issues
    db.execSync?.(`CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      image_url TEXT,
      lat REAL, lng REAL, address TEXT,
      upvotes INTEGER NOT NULL DEFAULT 0,
      downvotes INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );`);
    db.execSync?.(`CREATE INDEX IF NOT EXISTS idx_issues_created ON issues(created_at DESC);`);
    // votes
    db.execSync?.(`CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      issue_id INTEGER NOT NULL,
      value INTEGER NOT NULL CHECK (value IN (-1,1)),
      created_at TEXT NOT NULL,
      UNIQUE(user_id, issue_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(issue_id) REFERENCES issues(id) ON DELETE CASCADE
    );`);
    // comments
    db.execSync?.(`CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issue_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      parent_id INTEGER,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(issue_id) REFERENCES issues(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(parent_id) REFERENCES comments(id) ON DELETE CASCADE
    );`);
    db.execSync?.(`CREATE INDEX IF NOT EXISTS idx_comments_issue ON comments(issue_id);`);
    // authorities (optional)
    db.execSync?.(`CREATE TABLE IF NOT EXISTS authorities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      handle TEXT NOT NULL,
      region TEXT
    );`);
  });
}


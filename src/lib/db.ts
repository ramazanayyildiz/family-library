// Simple JSON-based database for Family Library App
// No native modules needed!

import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'library-data.json');

interface Database {
  users: any[];
  books: any[];
  userBooks: any[];
  shelves: any[];
  shelfBooks: any[];
  tags: any[];
  bookTags: any[];
  familySettings: any[];
}

let dbInstance: Database | null = null;

function loadDb(): Database {
  if (!dbInstance) {
    if (fs.existsSync(DB_PATH)) {
      dbInstance = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } else {
      dbInstance = {
        users: [],
        books: [],
        userBooks: [],
        shelves: [],
        shelfBooks: [],
        tags: [],
        bookTags: [],
        familySettings: [{ id: 1, family_name: 'Our Family Library', created_at: new Date().toISOString() }]
      };
      saveDb();
    }
  }
  return dbInstance;
}

function saveDb() {
  if (dbInstance) {
    fs.writeFileSync(DB_PATH, JSON.stringify(dbInstance, null, 2));
  }
}

// Helper functions
export function find<T>(table: keyof Database, predicate: (item: T) => boolean): T | null {
  const db = loadDb();
  return (db[table] as T[]).find(predicate) || null;
}

export function findAll<T>(table: keyof Database, predicate?: (item: T) => boolean): T[] {
  const db = loadDb();
  const items = db[table] as T[];
  return predicate ? items.filter(predicate) : items;
}

export function insert(table: keyof Database, data: any): any {
  const db = loadDb();
  const id = Date.now();
  const newItem = { ...data, id, created_at: new Date().toISOString() };
  (db[table] as any[]).push(newItem);
  saveDb();
  return { lastInsertRowid: id };
}

export function update(table: keyof Database, id: number, data: any): void {
  const db = loadDb();
  const items = db[table] as any[];
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
    saveDb();
  }
}

export function remove(table: keyof Database, id: number): void {
  const db = loadDb();
  const items = db[table] as any[];
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    saveDb();
  }
}

export function runQuery(table: keyof Database, sql: string, params: any[] = []): any[] {
  // Simple query simulation
  return findAll(table);
}

export default loadDb;

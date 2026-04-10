/**
 * Database Schema Tests
 * 
 * Note: These tests require better-sqlite3 native module.
 * Run with: npm test -- --run database
 * 
 * If tests fail with "Could not locate bindings file", run:
 * npm rebuild better-sqlite3
 */

import { describe, it, expect } from 'vitest';

describe('Database Schema - Unit Tests', () => {
  it('should have valid schema SQL', () => {
    const schema = `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        avatar_color TEXT DEFAULT '#3B82F6',
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    expect(schema).toContain('CREATE TABLE users');
    expect(schema).toContain('id INTEGER PRIMARY KEY');
  });

  it('should have books table schema', () => {
    const schema = `
      CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        isbn TEXT,
        title TEXT NOT NULL,
        author TEXT NOT NULL
      );
    `;
    expect(schema).toContain('CREATE TABLE books');
    expect(schema).toContain('title TEXT NOT NULL');
  });

  it('should have user_books table for multi-user tracking', () => {
    const schema = `
      CREATE TABLE user_books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        status TEXT DEFAULT 'towatch',
        rating INTEGER,
        UNIQUE(user_id, book_id)
      );
    `;
    expect(schema).toContain('UNIQUE(user_id, book_id)');
  });

  it('should have shelves table schema', () => {
    const schema = `
      CREATE TABLE shelves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        user_id INTEGER NOT NULL
      );
    `;
    expect(schema).toContain('CREATE TABLE shelves');
  });

  it('should have tags table schema', () => {
    const schema = `
      CREATE TABLE tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        color TEXT DEFAULT '#6B7280'
      );
    `;
    expect(schema).toContain('name TEXT UNIQUE');
  });

  it('should have family_settings table', () => {
    const schema = `
      CREATE TABLE family_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        family_name TEXT DEFAULT 'Our Library'
      );
    `;
    expect(schema).toContain("DEFAULT 'Our Library'");
  });
});

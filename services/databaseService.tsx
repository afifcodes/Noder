import * as SQLite from "expo-sqlite";

export function openDatabase() {
  const db = SQLite.openDatabase("noderdatabase.db");
  return db;
}

import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import { InferSelectModel } from "drizzle-orm";

export const chat = sqliteTable("chat", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  title: text("title").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  visibility: text("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = sqliteTable("message", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  chatId: text("chat_id")
    .notNull()
    .references(() => chat.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type Message = InferSelectModel<typeof message>;
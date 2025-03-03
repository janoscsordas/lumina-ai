import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import { InferSelectModel, relations } from "drizzle-orm";

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
    .references(() => user.id, { onDelete: "cascade" }),
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
    .references(() => chat.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content", { mode: 'json' }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type Message = InferSelectModel<typeof message>;

export const chatRelations = relations(chat, ({ many }) => ({
  messages: many(message)
}));

export const messageRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  })
}));

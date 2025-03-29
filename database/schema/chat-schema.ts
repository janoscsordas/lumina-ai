import { integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
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
  isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().default(false)
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
  content: text("content", { mode: "json" }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type Message = InferSelectModel<typeof message>;

export const monthlyMessageCounts = sqliteTable("monthly_message_counts", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  messageCount: integer("count").notNull().default(0),
}, (table) => ({
  uniqueUserMonthIdx: uniqueIndex("unique_user_month_idx")
   .on(table.userId, table.year, table.month),
}));

export const vote = sqliteTable("vote", {
  chatId: text("chat_id").notNull().references(() => chat.id, { onDelete: "cascade" }),
  messageId: text("message_id").notNull().references(() => message.id, { onDelete: "cascade" }),
  isUpVoted: integer("is_upvoted", { mode: "boolean" }).notNull()
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.chatId, table.messageId] })
  }
})

export type Vote = InferSelectModel<typeof vote>;

export const userRelations = relations(user, ({ many }) => ({
  chats: many(chat),
  monthlyMessageCounts: many(monthlyMessageCounts),
}));

export const chatRelations = relations(chat, ({ one, many }) => ({
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
  messages: many(message),
}));

export const messageRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  }),
}));

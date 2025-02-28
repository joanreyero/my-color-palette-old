// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  pgEnum,
  text,
  varchar,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name);

export const seasonEnum = pgEnum("season", [
  "winter",
  "summer",
  "spring",
  "autumn",
]);

export const subSeasonEnum = pgEnum("sub_season", [
  "Bright Winter",
  "True Winter",
  "Dark Winter",
  "Light Summer",
  "True Summer",
  "Soft Summer",
  "Light Spring",
  "True Spring",
  "Bright Spring",
  "Soft Autumn",
  "True Autumn",
  "Dark Autumn",
]);

export const genderEnum = pgEnum("gender", ["male", "female"]);

export const palette = createTable("palette", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  season: seasonEnum("season").notNull(),
  subSeason: subSeasonEnum("sub_season").notNull(),
  description: text("description"),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const paletteEmail = createTable("palette_email", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  email: varchar("email", { length: 255 }).notNull(),
  paletteId: integer("palette_id")
    .notNull()
    .references(() => palette.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const colors = createTable("colors", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  paletteId: integer("palette_id")
    .notNull()
    .references(() => palette.id),
  name: varchar("name", { length: 255 }).notNull(),
  hex: varchar("hex", { length: 7 }).notNull(), // Format: #RRGGBB
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  isRecommended: boolean("is_recommended").default(false),
  reason: text("reason"),
});

export const celebrities = createTable("celebrities", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  paletteId: integer("palette_id")
    .notNull()
    .references(() => palette.id),
  name: varchar("name", { length: 255 }).notNull(),
  gender: genderEnum("gender").notNull(),
});

// Define the relationships
export const paletteRelations = relations(palette, ({ many }) => ({
  colors: many(colors),
  celebrities: many(celebrities),
  emails: many(paletteEmail),
}));

export const colorsRelations = relations(colors, ({ one }) => ({
  palette: one(palette, {
    fields: [colors.paletteId],
    references: [palette.id],
  }),
}));

export const celebritiesRelations = relations(celebrities, ({ one }) => ({
  palette: one(palette, {
    fields: [celebrities.paletteId],
    references: [palette.id],
  }),
}));

export const paletteEmailRelations = relations(paletteEmail, ({ one }) => ({
  palette: one(palette, {
    fields: [paletteEmail.paletteId],
    references: [palette.id],
  }),
}));

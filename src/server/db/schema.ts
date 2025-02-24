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

export const palette = createTable("palette", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  season: seasonEnum("season").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const recommendedColours = createTable("recommended_colours", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  paletteId: integer("palette_id")
    .notNull()
    .references(() => palette.id),
  name: varchar("name", { length: 255 }).notNull(),
  hex: varchar("hex", { length: 7 }).notNull(), // Format: #RRGGBB
  reason: text("reason").notNull(),
});

// Define the relationships
export const paletteRelations = relations(palette, ({ many }) => ({
  recommendedColours: many(recommendedColours),
}));

export const recommendedColoursRelations = relations(
  recommendedColours,
  ({ one }) => ({
    palette: one(palette, {
      fields: [recommendedColours.paletteId],
      references: [palette.id],
    }),
  }),
);

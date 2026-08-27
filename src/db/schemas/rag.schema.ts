
// TODO: EDIT AS PER REQRUIEMENTS AND UNCOMMENT ONCE REQUIRED ONLY
// import {
//   customType,
//   pgTable,
//   timestamp,
//   uuid,
//   varchar,
//   text,
// } from "drizzle-orm/pg-core";

// const vector = customType<{
//     data: number[];
//     driverData: string;
// }>({
//   dataType() {
//     return "vector";
//   },

//   toDriver(value) {
//     return `[${value.join(",")}]`;
//   },

//   fromDriver(value) {
//     return JSON.parse(`[${value.slice(1, -1)}]`);
//   },
// });

// export const rag = pgTable("rag", {
//   id: uuid("id").defaultRandom().primaryKey(),

//   context: text("context").notNull(),

//   source: varchar("source", {
//     length: 255,
//   }).notNull(),

//   embedding: vector("embedding").notNull(),

//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//   })
//     .defaultNow()
//     .notNull(),
// });


/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Skin analysis results table
 */
export const skinAnalyses = mysqlTable("skin_analyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  imageUrl: text("imageUrl").notNull(),
  
  // User context from questionnaire
  skinTypeSelfReported: varchar("skinTypeSelfReported", { length: 50 }),
  concern: varchar("concern", { length: 100 }),
  recentTreatments: text("recentTreatments"),
  routineLevel: varchar("routineLevel", { length: 100 }),
  sunscreenUsage: varchar("sunscreenUsage", { length: 50 }),
  
  // Analysis results
  skinHealthScore: int("skinHealthScore"),
  ageGroup: varchar("ageGroup", { length: 20 }),
  relativePosition: varchar("relativePosition", { length: 50 }),
  skinTypeEstimate: varchar("skinTypeEstimate", { length: 50 }),
  
  // Full JSON response from LLM
  analysisJson: json("analysisJson"),
  
  // Payment info
  language: varchar("language", { length: 2 }).default("fa"),
  isPaid: int("isPaid").default(0),
  paymentChargeId: varchar("paymentChargeId", { length: 100 }),
  
  // Referral info
  referralCode: varchar("referralCode", { length: 20 }),
  referredBy: varchar("referredBy", { length: 64 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SkinAnalysis = typeof skinAnalyses.$inferSelect;
export type InsertSkinAnalysis = typeof skinAnalyses.$inferInsert;

// Alias for backward compatibility
export const analyses = skinAnalyses;

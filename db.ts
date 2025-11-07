// Skin analysis helpers
export async function createSkinAnalysis(analysis: InsertSkinAnalysis): Promise<SkinAnalysis> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(skinAnalyses).values(analysis);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(skinAnalyses).where(eq(skinAnalyses.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getUserAnalyses(userId: number): Promise<SkinAnalysis[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return db.select().from(skinAnalyses).where(eq(skinAnalyses.userId, userId)).orderBy(desc(skinAnalyses.createdAt));
}

export async function getAnalysisById(id: number): Promise<SkinAnalysis | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(skinAnalyses).where(eq(skinAnalyses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

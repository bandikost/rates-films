
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function getPosts() {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM telegram_posts ORDER BY published_at DESC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET POSTS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

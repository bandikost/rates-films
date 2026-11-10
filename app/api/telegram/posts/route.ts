
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        channel_id,
        telegram_message_id,
        media_group_id,
        text,
        entities,
        caption_entities,
        published_at,
        edited_at
      FROM telegram_posts
      ORDER BY published_at DESC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Posts fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

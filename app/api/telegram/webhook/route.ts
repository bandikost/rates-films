import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  try {
    await db.query("SELECT 1");

    return NextResponse.json({
      status: "ok",
      database: "connected",
      service: "telegram-webhook",
    });
  } catch (error: any) {
    console.error("MYSQL CONNECTION ERROR:", {
      code: error.code,
      message: error.message,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port,
    });

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        errorCode: error.code || "UNKNOWN",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const update = await req.json();

  if (!update.channel_post) {
    return NextResponse.json({ ok: true });
  }

  const post = update.channel_post;

  await db.execute(
    `INSERT INTO telegram_posts
      (telegram_message_id, text, published_at)
     VALUES (?, ?, FROM_UNIXTIME(?))
     ON DUPLICATE KEY UPDATE
      text = VALUES(text)`,
    [
      post.message_id,
      post.text || post.caption || "",
      post.date
    ]
  );

  return NextResponse.json({ ok: true });
}
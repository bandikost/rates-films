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
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { status: "error", database: "disconnected" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    const receivedSecret = req.headers.get(
      "x-telegram-bot-api-secret-token"
    );

    if (!secret || receivedSecret !== secret) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const update = await req.json();

    const post =
      update.channel_post ?? update.edited_channel_post;

    if (!post) {
      return NextResponse.json({ ok: true });
    }

    const channelId = String(post.chat.id);

    if (
      process.env.TELEGRAM_CHANNEL_ID &&
      channelId !== process.env.TELEGRAM_CHANNEL_ID
    ) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const isEdited = Boolean(update.edited_channel_post);

    await db.execute(
      `INSERT INTO telegram_posts (
        channel_id,
        telegram_message_id,
        media_group_id,
        text,
        entities,
        caption_entities,
        raw_message,
        published_at,
        edited_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?), ${
        isEdited ? "FROM_UNIXTIME(?)" : "NULL"
      })
      ON DUPLICATE KEY UPDATE
        text = VALUES(text),
        entities = VALUES(entities),
        caption_entities = VALUES(caption_entities),
        raw_message = VALUES(raw_message),
        edited_at = VALUES(edited_at)`,
      [
        channelId,
        post.message_id,
        post.media_group_id ?? null,
        post.text ?? post.caption ?? null,
        JSON.stringify(post.entities ?? null),
        JSON.stringify(post.caption_entities ?? null),
        JSON.stringify(post),
        post.date,
        ...(isEdited ? [post.edit_date ?? post.date] : []),
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);

    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
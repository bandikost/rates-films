
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
  console.log("========== TELEGRAM WEBHOOK RECEIVED ==========");

  try {
    // 1. Проверяем авторизацию
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    const receivedSecret = req.headers.get(
      "x-telegram-bot-api-secret-token"
    );

    console.log("WEBHOOK AUTH CHECK:", {
      envExists: Boolean(secret),
      receivedExists: Boolean(receivedSecret),
      matches: secret === receivedSecret,
    });

    if (!secret || receivedSecret !== secret) {
      console.error("WEBHOOK UNAUTHORIZED");

      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Читаем тело запроса ОДИН раз
    const update = await req.json();

    const post =
      update.channel_post ?? update.edited_channel_post;

    console.log("TELEGRAM UPDATE:", {
      updateId: update.update_id,
      hasChannelPost: Boolean(update.channel_post),
      hasEditedChannelPost: Boolean(update.edited_channel_post),
      chatId: post?.chat?.id,
      messageId: post?.message_id,
    });

    // 3. Если это не публикация канала
    if (!post) {
      console.log("IGNORED: No channel post");

      return NextResponse.json({ ok: true });
    }

    // 4. Проверяем ID канала
    const channelId = String(post.chat.id);
    const expectedChannelId = process.env.TELEGRAM_CHANNEL_ID;

    console.log("CHANNEL CHECK:", {
      receivedChannelId: channelId,
      expectedChannelId,
      matches: channelId === expectedChannelId,
    });

    if (
      expectedChannelId &&
      channelId !== expectedChannelId
    ) {
      console.log("IGNORED: Channel ID mismatch");

      return NextResponse.json({
        ok: true,
        ignored: true,
      });
    }

    // 5. Определяем тип обновления
    const isEdited = Boolean(update.edited_channel_post);

    console.log("INSERTING TELEGRAM POST:", post.message_id);

    // 6. Сохраняем публикацию
    const [result] = await db.execute(
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

    console.log("TELEGRAM POST SAVED:", {
      messageId: post.message_id,
      affectedRows: (result as { affectedRows: number }).affectedRows,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("TELEGRAM WEBHOOK ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

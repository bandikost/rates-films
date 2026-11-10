export type TelegramPost = {
  id: number;
  channel_id: string;
  telegram_message_id: number;
  media_group_id: string | null;
  text: string | null;
  published_at: string;
  edited_at: string | null;
};
import net from "node:net";
import { NextResponse } from "next/server";

export async function GET() {
  const host = process.env.DB_HOST!;
  const port = Number(process.env.DB_PORT || 3306);

  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });

    socket.setTimeout(5000);

    socket.on("connect", () => {
      socket.destroy();
      resolve(
        NextResponse.json({
          tcp: "connected",
          host,
          port,
        })
      );
    });

    socket.on("error", (error) => {
      resolve(
        NextResponse.json({
          tcp: "failed",
        
          host,
          port,
        })
      );
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(
        NextResponse.json({
          tcp: "timeout",
          host,
          port,
        })
      );
    });
  });
}
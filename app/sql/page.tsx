import { sql } from "@vercel/postgres";
import React from "react";
import CreateStickr from "@/lib/create-stickr";
import { revalidatePath } from "next/cache";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let sticker = searchParams["sticker"];
  if (Array.isArray(sticker)) {
    sticker = sticker[0];
  }
  if (sticker) {
    await sql`INSERT INTO stickerdb (Url) VALUES (${sticker})`;
  }

  let data;
  try {
    data = await sql`SELECT * FROM stickerdb;`;
  } catch (error: any) {
    console.error(error);
  }

  // @ts-ignore
  const { rows: stickers } = data;
  console.log(stickers);
  revalidatePath("/sql");

  return (
    <div>
      <CreateStickr />

      {searchParams["sticker"] ? "yes" : "no"}

      {stickers.map((sticker: any) => (
        <>
          <p key={sticker.url}>{sticker.url}</p>
          <hr className="border-1 border-black" />
        </>
      ))}
    </div>
  );
}

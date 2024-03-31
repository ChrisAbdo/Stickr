"use client";
import * as fal from "@fal-ai/serverless-client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

fal.config({
  proxyUrl: "/api/fal/proxy",
});

export default function CreateStickr() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  async function generateSticker() {
    const result = await fal.subscribe("fal-ai/face-to-sticker", {
      input: {
        image_url: "https://i.insider.com/62702fc240473e0018a18da6?width=700",
        prompt: "a person",
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    console.log(result.sticker_image_background_removed.url);
    router.push(
      pathname +
        "?" +
        createQueryString(
          "sticker",
          result.sticker_image_background_removed.url
        )
    );
  }
  return (
    <div>
      <button onClick={generateSticker}>Generate Sticker</button>
    </div>
  );
}

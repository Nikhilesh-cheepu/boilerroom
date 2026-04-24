import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdminSession } from "@/lib/auth/admin-server";
import { isBlobConfigured } from "@/lib/blob/hero";

export const runtime = "nodejs";
export const maxDuration = 120;

const ALLOWED_PREFIXES = ["gallery/", "hero/"] as const;

export async function POST(request: Request): Promise<NextResponse> {
  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "Set BLOB_READ_WRITE_TOKEN in the server environment." },
      { status: 400 },
    );
  }

  try {
    const body = (await request.json()) as HandleUploadBody & { pathname?: string };
    const pathname = String(body.pathname ?? "");

    const isAllowedPath = ALLOWED_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix),
    );
    if (!isAllowedPath) {
      return NextResponse.json(
        { error: "Invalid upload path. Use gallery/ or hero/." },
        { status: 400 },
      );
    }

    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await isAdminSession())) {
          throw new Error("Not signed in.");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ],
          maximumSizeInBytes: 20 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        void blob;
      },
    });

    return NextResponse.json(json);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

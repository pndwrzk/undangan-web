import { NextRequest, NextResponse } from "next/server";
import { stat, createReadStream } from "fs";
import { promisify } from "util";
import path from "path";

const statAsync = promisify(stat);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const filePath = path.join(process.cwd(), "uploads", "songs", filename);

  try {
    const stats = await statAsync(filePath);
    const fileSize = stats.size;
    const range = request.headers.get("range");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`,
          },
        });
      }

      const chunksize = end - start + 1;
      const fileStream = createReadStream(filePath, { start, end });

      // @ts-ignore - ReadableStream conversion
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk));
          fileStream.on("end", () => controller.close());
          fileStream.on("error", (err) => controller.error(err));
        },
        cancel() {
          fileStream.destroy();
        },
      });

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": "audio/mpeg",
        },
      });
    } else {
      const fileStream = createReadStream(filePath);
      // @ts-ignore - ReadableStream conversion
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk));
          fileStream.on("end", () => controller.close());
          fileStream.on("error", (err) => controller.error(err));
        },
        cancel() {
          fileStream.destroy();
        },
      });

      return new NextResponse(stream as any, {
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": "audio/mpeg",
          "Accept-Ranges": "bytes",
        },
      });
    }
  } catch (error) {
    console.error("Error serving audio file:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}

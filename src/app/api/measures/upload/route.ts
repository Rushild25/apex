import { auth } from "@/auth";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "progress");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `progress_${session.user.id}_${Date.now()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, buffer);

    const publicUrl = `/uploads/progress/${filename}`;
    return NextResponse.json({ url: publicUrl, success: true });
  } catch (error) {
    console.error("Failed to upload progress photo:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

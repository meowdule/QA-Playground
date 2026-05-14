import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { authorId, body: text } = body;
  if (!authorId || !text) return NextResponse.json({ error: "missing" }, { status: 400 });
  const c = await prisma.comment.create({
    data: {
      postId: params.id,
      authorId: String(authorId),
      body: String(text),
    },
  });
  return NextResponse.json(c);
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const where = category ? { category } : {};
  const posts = await prisma.boardPost.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { category, title, content, relatedMissionId, authorId } = body;
  if (!category || !title || !content || !authorId) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const post = await prisma.boardPost.create({
    data: {
      category: String(category),
      title: String(title),
      content: String(content),
      relatedMissionId: relatedMissionId ? String(relatedMissionId) : null,
      authorId: String(authorId),
    },
  });
  return NextResponse.json(post);
}

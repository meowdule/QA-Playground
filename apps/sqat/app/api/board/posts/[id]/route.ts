import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.boardPost.findUnique({
    where: { id: params.id },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(post);
}

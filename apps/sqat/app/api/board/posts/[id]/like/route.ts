import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.boardPost.update({
    where: { id: params.id },
    data: { likes: { increment: 1 } },
  });
  return NextResponse.json(post);
}

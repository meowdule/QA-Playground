import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.boardPost.update({
    where: { id: params.id },
    data: { hasOfficialReply: true, isResolved: true },
  });
  return NextResponse.json(post);
}

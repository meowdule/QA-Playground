import { notFound } from "next/navigation";
import { getMission } from "@/lib/content/missions";
import { MissionSubmitResult } from "@/components/MissionSubmitResult";

export default function MissionSubmitPage({ params }: { params: { id: string } }) {
  const mission = getMission(params.id);
  if (!mission) notFound();
  return <MissionSubmitResult mission={mission} />;
}

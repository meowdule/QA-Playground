import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LEARNING_CONTENT, LEARNING_CATEGORY_LABEL } from "@/lib/content/learning";

export function generateStaticParams() {
  return LEARNING_CONTENT.map((a) => ({ id: a.id }));
}

export default function LearnArticlePage({ params }: { params: { id: string } }) {
  const article = LEARNING_CONTENT.find((a) => a.id === params.id);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase text-indigo-600">{LEARNING_CATEGORY_LABEL[article.category]}</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{article.title}</h1>
      <p className="mt-1 text-sm text-slate-500">예상 {article.estimatedMinutes}분</p>
      <div className="mt-8 text-sm leading-relaxed text-slate-800 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_li]:ml-4 [&_li]:list-disc [&_table]:w-full [&_table]:text-xs [&_th]:border [&_th]:bg-slate-100 [&_th]:p-2 [&_td]:border [&_td]:p-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
      </div>
      <section className="mt-12 rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
        <h2 className="text-sm font-bold text-indigo-900">관련 미션 바로가기</h2>
        {article.relatedMissionIds.length === 0 && <p className="mt-2 text-sm text-slate-600">등록된 링크가 없습니다.</p>}
        <ul className="mt-2 space-y-1">
          {article.relatedMissionIds.map((mid) => (
            <li key={mid}>
              <Link href={`/missions/${mid}`} className="text-sm font-medium text-indigo-700 hover:underline">
                {mid}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Link href="/learn" className="mt-8 inline-block text-sm text-slate-600 hover:underline">
        ← 학습 목록
      </Link>
    </article>
  );
}

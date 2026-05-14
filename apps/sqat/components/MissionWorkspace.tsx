"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Mission } from "@/lib/types";

const SEV = ["blocker", "critical", "major", "minor", "trivial"] as const;
const RES = ["PASS", "FAIL", "NA", "NT", "BLOCK"] as const;

export function MissionWorkspace({ mission }: { mission: Mission }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  function navigateToSubmit() {
    setBusy(true);
    router.push(`/missions/${mission.id}/submit`);
  }

  const initialChecks = useMemo(
    () => Object.fromEntries((mission.content.scenarioSteps ?? []).map((_, i) => [`s${i}`, false])),
    [mission]
  );
  const [checks, setChecks] = useState<Record<string, boolean>>(initialChecks);

  function persistAndGo() {
    setBusy(true);
    const payload = { missionId: mission.id, at: Date.now() };
    sessionStorage.setItem(`sqat-submit-${mission.id}`, JSON.stringify(payload));
    navigateToSubmit();
  }

  if (mission.type === "scenario") {
    const steps = mission.content.scenarioSteps ?? [];
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">시나리오</h2>
          <div className="mt-3 max-w-none text-sm leading-relaxed text-slate-700 [&_strong]:text-slate-900">
            <p>{mission.content.specMarkdown}</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">TC 체크리스트</h2>
          <ul className="mt-4 space-y-3">
            {steps.map((s, i) => {
              const k = `s${i}`;
              return (
                <li key={k} className="flex gap-3">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={!!checks[k]}
                    onChange={(e) => setChecks((c) => ({ ...c, [k]: e.target.checked }))}
                  />
                  <span className="text-sm text-slate-800">{s}</span>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            disabled={busy || !steps.every((_, i) => checks[`s${i}`])}
            onClick={persistAndGo}
            className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            수행 완료 · 제출 화면으로
          </button>
        </div>
      </div>
    );
  }

  if (mission.type === "tc_writing") {
    return (
      <TcWritingForm mission={mission} onSubmit={navigateToSubmit} busy={busy} setBusy={setBusy} />
    );
  }

  if (mission.type === "report") {
    return <ReportForm mission={mission} onSubmit={navigateToSubmit} busy={busy} setBusy={setBusy} />;
  }

  if (mission.type === "defect_report") {
    return <DefectReportForm mission={mission} onSubmit={navigateToSubmit} busy={busy} setBusy={setBusy} />;
  }

  if (mission.type === "defect_classify") {
    return <ClassifyForm mission={mission} onSubmit={navigateToSubmit} busy={busy} setBusy={setBusy} />;
  }

  if (mission.type === "defect_verify") {
    return <VerifyForm mission={mission} onSubmit={navigateToSubmit} busy={busy} setBusy={setBusy} />;
  }

  return <p className="text-slate-600">알 수 없는 미션 타입입니다.</p>;
}

function TcWritingForm({
  mission,
  onSubmit,
  busy,
  setBusy,
}: {
  mission: Mission;
  onSubmit: () => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
}) {
  const [rows, setRows] = useState([{ id: "", pre: "", steps: "", exp: "" }]);
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-800 [&_table]:w-full [&_table]:text-xs [&_th]:border [&_th]:bg-slate-100 [&_th]:p-2 [&_td]:border [&_td]:p-2">
        <p>{mission.content.specMarkdown}</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase text-slate-500">
              <th className="p-2">TC ID</th>
              <th className="p-2">전제</th>
              <th className="p-2">단계</th>
              <th className="p-2">기대</th>
              <th className="p-2 w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="p-1">
                  <input className="w-full rounded border px-2 py-1" value={r.id} onChange={(e) => {
                    const n = [...rows];
                    n[idx] = { ...r, id: e.target.value };
                    setRows(n);
                  }} />
                </td>
                <td className="p-1">
                  <textarea className="w-full rounded border px-2 py-1" rows={2} value={r.pre} onChange={(e) => {
                    const n = [...rows];
                    n[idx] = { ...r, pre: e.target.value };
                    setRows(n);
                  }} />
                </td>
                <td className="p-1">
                  <textarea className="w-full rounded border px-2 py-1" rows={2} value={r.steps} onChange={(e) => {
                    const n = [...rows];
                    n[idx] = { ...r, steps: e.target.value };
                    setRows(n);
                  }} />
                </td>
                <td className="p-1">
                  <textarea className="w-full rounded border px-2 py-1" rows={2} value={r.exp} onChange={(e) => {
                    const n = [...rows];
                    n[idx] = { ...r, exp: e.target.value };
                    setRows(n);
                  }} />
                </td>
                <td className="p-1">
                  <button type="button" className="text-rose-600" onClick={() => setRows(rows.filter((_, i) => i !== idx))}>
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="mt-2 text-sm font-medium text-indigo-600" onClick={() => setRows([...rows, { id: "", pre: "", steps: "", exp: "" }])}>
          + 행 추가
        </button>
      </div>
      <textarea className="w-full rounded-lg border border-slate-200 p-3 text-sm" rows={6} placeholder="Markdown 메모 (차후 @uiw/react-md-editor)" />
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          sessionStorage.setItem(`sqat-submit-${mission.id}`, JSON.stringify({ rows, at: Date.now() }));
          onSubmit();
        }}
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
      >
        제출
      </button>
    </div>
  );
}

function ReportForm({
  mission,
  onSubmit,
  busy,
  setBusy,
}: {
  mission: Mission;
  onSubmit: () => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
}) {
  const ids = mission.content.reportTcIds ?? [];
  const [state, setState] = useState(() =>
    Object.fromEntries(ids.map((id) => [id, { r: "PASS" as string, note: "" }]))
  );
  return (
    <div className="space-y-4">
      {ids.map((id) => (
        <div key={id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm font-semibold">{id}</span>
            <select
              className="rounded border px-2 py-1 text-sm"
              value={state[id].r}
              onChange={(e) =>
                setState((s) => ({ ...s, [id]: { ...s[id], r: e.target.value } }))
              }
            >
              {RES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          {(state[id].r === "FAIL" || state[id].r === "BLOCK") && (
            <textarea
              className="mt-3 w-full rounded border p-2 text-sm"
              placeholder="결함 내용"
              value={state[id].note}
              onChange={(e) => setState((s) => ({ ...s, [id]: { ...s[id], note: e.target.value } }))}
            />
          )}
        </div>
      ))}
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          sessionStorage.setItem(`sqat-submit-${mission.id}`, JSON.stringify({ state, at: Date.now() }));
          onSubmit();
        }}
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
      >
        제출
      </button>
    </div>
  );
}

function DefectReportForm({
  mission,
  onSubmit,
  busy,
  setBusy,
}: {
  mission: Mission;
  onSubmit: () => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [exp, setExp] = useState("");
  const [act, setAct] = useState("");
  const [sev, setSev] = useState<(typeof SEV)[number]>("major");
  const [env, setEnv] = useState("");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">{mission.content.specMarkdown}</div>
      <label className="block text-sm font-medium">결함 제목</label>
      <input className="w-full rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="block text-sm font-medium">재현 단계 (줄바꿈으로 순서)</label>
      <textarea className="w-full rounded border px-3 py-2" rows={5} value={steps} onChange={(e) => setSteps(e.target.value)} />
      <label className="block text-sm font-medium">기대 결과</label>
      <textarea className="w-full rounded border px-3 py-2" rows={3} value={exp} onChange={(e) => setExp(e.target.value)} />
      <label className="block text-sm font-medium">실제 결과</label>
      <textarea className="w-full rounded border px-3 py-2" rows={3} value={act} onChange={(e) => setAct(e.target.value)} />
      <label className="block text-sm font-medium">심각도</label>
      <select className="rounded border px-3 py-2" value={sev} onChange={(e) => setSev(e.target.value as (typeof SEV)[number])}>
        {SEV.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <label className="block text-sm font-medium">환경 (OS, 브라우저, 버전)</label>
      <input className="w-full rounded border px-3 py-2" value={env} onChange={(e) => setEnv(e.target.value)} />
      <button
        type="button"
        disabled={busy || !title || !steps || !exp || !act}
        onClick={() => {
          setBusy(true);
          sessionStorage.setItem(
            `sqat-submit-${mission.id}`,
            JSON.stringify({ title, steps, exp, act, sev, env, at: Date.now() })
          );
          onSubmit();
        }}
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
      >
        제출
      </button>
    </div>
  );
}

function ClassifyForm({
  mission,
  onSubmit,
  busy,
  setBusy,
}: {
  mission: Mission;
  onSubmit: () => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
}) {
  const cases = mission.content.classifyCases ?? [];
  const [ans, setAns] = useState(() =>
    Object.fromEntries(cases.map((c) => [c.id, { sev: "major" as (typeof SEV)[number], why: "" }]))
  );
  return (
    <div className="space-y-6">
      {cases.map((c) => (
        <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-800">{c.description}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <select
              className="rounded border px-2 py-1 text-sm"
              value={ans[c.id].sev}
              onChange={(e) =>
                setAns((a) => ({
                  ...a,
                  [c.id]: { ...a[c.id], sev: e.target.value as (typeof SEV)[number] },
                }))
              }
            >
              {SEV.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="mt-3 w-full rounded border p-2 text-sm"
            placeholder="판단 근거"
            value={ans[c.id].why}
            onChange={(e) =>
              setAns((a) => ({ ...a, [c.id]: { ...a[c.id], why: e.target.value } }))
            }
          />
          <details className="mt-2 text-xs text-slate-500">
            <summary className="cursor-pointer font-medium text-indigo-600">심각도 기준 힌트 (차후 점수 차감)</summary>
            <p className="mt-1">Blocker~Trivial 기준은 학습 &gt; 결함 관리 아티클을 참고하세요.</p>
          </details>
        </div>
      ))}
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          sessionStorage.setItem(`sqat-submit-${mission.id}`, JSON.stringify({ ans, at: Date.now() }));
          onSubmit();
        }}
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
      >
        제출
      </button>
    </div>
  );
}

function VerifyForm({
  mission,
  onSubmit,
  busy,
  setBusy,
}: {
  mission: Mission;
  onSubmit: () => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
}) {
  const cases = mission.content.verifyCases ?? [];
  type Choice = "still" | "fixed";
  const [ans, setAns] = useState(() =>
    Object.fromEntries(
      cases.map((c) => [
        c.defectId,
        { choice: "fixed" as Choice, note: "" },
      ])
    )
  );
  return (
    <div className="space-y-5">
      {cases.map((c) => (
        <div key={c.defectId} className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-mono text-xs text-slate-500">{c.defectId}</span>
            <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
          </div>
          <p className="mt-2 text-sm text-slate-600">개발자: {c.devComment}</p>
          {c.hint && <p className="mt-1 text-xs text-amber-800">힌트: {c.hint}</p>}
          <div className="mt-4 space-y-2 text-sm">
            <label className="flex gap-2">
              <input
                type="radio"
                name={c.defectId}
                checked={ans[c.defectId].choice === "still"}
                onChange={() =>
                  setAns((a) => ({ ...a, [c.defectId]: { ...a[c.defectId], choice: "still" } }))
                }
              />
              여전히 결함 존재
            </label>
            <label className="flex gap-2">
              <input
                type="radio"
                name={c.defectId}
                checked={ans[c.defectId].choice === "fixed"}
                onChange={() =>
                  setAns((a) => ({ ...a, [c.defectId]: { ...a[c.defectId], choice: "fixed" } }))
                }
              />
              수정 완료 확인
            </label>
          </div>
          <textarea
            className="mt-3 w-full rounded border p-2 text-sm"
            placeholder={ans[c.defectId].choice === "still" ? "재제보 / 현재 상태" : "확인 소견"}
            value={ans[c.defectId].note}
            onChange={(e) =>
              setAns((a) => ({
                ...a,
                [c.defectId]: { ...a[c.defectId], note: e.target.value },
              }))
            }
          />
        </div>
      ))}
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          sessionStorage.setItem(`sqat-submit-${mission.id}`, JSON.stringify({ ans, at: Date.now() }));
          onSubmit();
        }}
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
      >
        제출
      </button>
    </div>
  );
}

import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { getDashboardAnalytics } from "@/services/api";

type KpiDirection = "up" | "down";

interface DashboardKpi {
  label: string;
  value: string;
  trend: string;
  direction: KpiDirection;
}

interface VarianceDatum {
  month: string;
  previsto: number;
  real: number;
}

interface DivergenceDatum {
  name: string;
  value: number;
  color: string;
}

interface AuditRow {
  caseId: string;
  processId: string;
  escritorio: string;
  previsto: number;
  real: number;
  variancia: string;
  status: string;
}

const officeOptions = [
  { label: "Todos os escritórios", value: "all" },
  { label: "Costa & Associados", value: "costa" },
  { label: "Juris Minas", value: "juris" },
  { label: "Núcleo Contencioso BH", value: "nucleo" },
];

const actionOptions = [
  { label: "Todos os tipos", value: "all" },
  { label: "Ação Indenizatória", value: "indenizatoria" },
  { label: "Cobrança Indevida", value: "cobranca" },
  { label: "Revisão Contratual", value: "revisao" },
];

const defaultKpis: DashboardKpi[] = [
  {
    label: "Taxa de Aderência",
    value: "94,2%",
    trend: "+1,2% vs mês anterior",
    direction: "up",
  },
  {
    label: "Economia Gerada",
    value: "R$ 4,2M",
    trend: "+8,4% YTD",
    direction: "up",
  },
  {
    label: "Tempo Médio de Fechamento",
    value: "42 dias",
    trend: "-3 dias trend",
    direction: "down",
  },
  {
    label: "Efetividade",
    value: "88,5%",
    trend: "+0,5% resultados favoráveis",
    direction: "up",
  },
];

const defaultVarianceData: VarianceDatum[] = [
  { month: "JAN", previsto: 2.4, real: 1.9 },
  { month: "FEV", previsto: 2.8, real: 2.1 },
  { month: "MAR", previsto: 2.2, real: 2.0 },
  { month: "ABR", previsto: 3.1, real: 2.4 },
  { month: "MAI", previsto: 3.4, real: 2.7 },
  { month: "JUN", previsto: 3.0, real: 2.5 },
];

const defaultDivergenceData: DivergenceDatum[] = [
  { name: "Questões Probatórias", value: 45, color: "#0f2044" },
  { name: "Nova Jurisprudência", value: 30, color: "#5473c7" },
  { name: "Estratégia de Acordo", value: 15, color: "#90a6d8" },
  { name: "Outros", value: 10, color: "#ccd7eb" },
];

const defaultDivergenceCaseCount = 142;

const defaultAuditRows: AuditRow[] = [
  {
    caseId: "case-2418A",
    processId: "0801234-56.2024.8.10.0001",
    escritorio: "Costa & Associados",
    previsto: 17800,
    real: 24500,
    variancia: "+37,6%",
    status: "DIVERGENTE",
  },
  {
    caseId: "case-8831B",
    processId: "0654321-09.2024.8.04.0001",
    escritorio: "Juris Minas",
    previsto: 9200,
    real: 9100,
    variancia: "-1,1%",
    status: "OK",
  },
  {
    caseId: "case-5502C",
    processId: "0712456-14.2025.8.13.0024",
    escritorio: "Núcleo Contencioso BH",
    previsto: 11200,
    real: 15600,
    variancia: "+39,3%",
    status: "DIVERGENTE",
  },
  {
    caseId: "case-1940D",
    processId: "0723004-77.2025.8.13.0400",
    escritorio: "Costa & Associados",
    previsto: 8400,
    real: 8600,
    variancia: "+2,3%",
    status: "OK",
  },
  {
    caseId: "case-2911E",
    processId: "0812310-03.2024.8.10.0015",
    escritorio: "Juris Minas",
    previsto: 15800,
    real: 21400,
    variancia: "+35,4%",
    status: "DIVERGENTE",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyCompact(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPercent(value: number) {
  const normalized = value <= 1 ? value * 100 : value;
  return `${normalized.toFixed(1).replace(".", ",")}%`;
}

function formatTooltipValue(
  value: number | string | ReadonlyArray<number | string> | undefined,
  suffix = "",
) {
  const parsedValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Array.isArray(value)
          ? Number(value[0] ?? 0)
          : 0;

  return `${parsedValue}${suffix}`;
}

function deriveDirection(trend: string, fallback: KpiDirection) {
  const normalized = trend.trim();

  if (normalized.startsWith("-")) {
    return "down";
  }

  if (normalized.startsWith("+")) {
    return "up";
  }

  return fallback;
}

function useChartWidth() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setWidth(Math.max(0, Math.floor(element.getBoundingClientRect().width)));
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, width };
}

function exportAuditCsv(rows: AuditRow[]) {
  const header =
    "PROCESSO ID,ESCRITÓRIO,PREVISTO (R$),REAL (R$),VARIÂNCIA,STATUS\n";
  const body = rows
    .map((row) =>
      [
        row.processId,
        row.escritorio,
        row.previsto,
        row.real,
        row.variancia,
        row.status,
      ].join(","),
    )
    .join("\n");

  const blob = new Blob([header + body], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "processos-divergentes.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getRecordValue(
  record: Record<string, unknown> | null,
  keys: string[],
): Record<string, unknown> | null {
  if (!record) {
    return null;
  }

  for (const key of keys) {
    const value = record[key];

    if (isRecord(value)) {
      return value;
    }
  }

  return null;
}

function getNumberValue(
  record: Record<string, unknown> | null,
  keys: string[],
): number | null {
  if (!record) {
    return null;
  }

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

function getStringValue(
  record: Record<string, unknown> | null,
  keys: string[],
): string | null {
  if (!record) {
    return null;
  }

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function getArrayValue(
  record: Record<string, unknown> | null,
  keys: string[],
): unknown[] | null {
  if (!record) {
    return null;
  }

  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return null;
}

function mapVarianceData(raw: unknown): VarianceDatum[] | null {
  if (!isRecord(raw)) {
    return null;
  }

  const summary = getRecordValue(raw, ["summary"]);
  const source =
    getArrayValue(summary, ["costVariance", "varianceData"]) ??
    getArrayValue(raw, ["costVariance", "varianceData"]);

  if (!source) {
    return null;
  }

  const mapped = source
    .map((item): VarianceDatum | null => {
      if (!isRecord(item)) {
        return null;
      }

      const month =
        getStringValue(item, ["month", "label", "name"])?.toUpperCase() ?? "";
      const previsto = getNumberValue(item, ["previsto", "forecast", "planned"]);
      const real = getNumberValue(item, ["real", "actual", "observed"]);

      if (!month || previsto === null || real === null) {
        return null;
      }

      return { month, previsto, real };
    })
    .filter((item): item is VarianceDatum => item !== null);

  return mapped.length > 0 ? mapped : null;
}

function mapDivergenceData(raw: unknown): DivergenceDatum[] | null {
  if (!isRecord(raw)) {
    return null;
  }

  const summary = getRecordValue(raw, ["summary"]);
  const source =
    getArrayValue(summary, ["divergenceReasons", "reasons"]) ??
    getArrayValue(raw, ["divergenceReasons", "reasons"]);

  if (!source) {
    return null;
  }

  const fallbackColors = defaultDivergenceData.map((item) => item.color);
  const mapped = source
    .map((item, index): DivergenceDatum | null => {
      if (!isRecord(item)) {
        return null;
      }

      const name = getStringValue(item, ["name", "label", "reason"]);
      const value = getNumberValue(item, ["value", "percentage", "percent"]);
      const color =
        getStringValue(item, ["color"]) ??
        fallbackColors[index % fallbackColors.length];

      if (!name || value === null) {
        return null;
      }

      return { name, value, color };
    })
    .filter((item): item is DivergenceDatum => item !== null);

  return mapped.length > 0 ? mapped : null;
}

function mapDivergenceCaseCount(raw: unknown): number | null {
  if (!isRecord(raw)) {
    return null;
  }

  const summary = getRecordValue(raw, ["summary"]);

  return (
    getNumberValue(summary, ["caseCount", "cases", "totalCases"]) ??
    getNumberValue(raw, ["caseCount", "cases", "totalCases"])
  );
}

function mapAuditRows(raw: unknown): AuditRow[] | null {
  if (!isRecord(raw)) {
    return null;
  }

  const summary = getRecordValue(raw, ["summary"]);
  const source =
    getArrayValue(summary, ["divergentCases", "auditRows"]) ??
    getArrayValue(raw, ["divergentCases", "auditRows"]);

  if (!source) {
    return null;
  }

  const mapped = source
    .map((item): AuditRow | null => {
      if (!isRecord(item)) {
        return null;
      }

      const caseId = getStringValue(item, ["caseId", "id"]) ?? "";
      const processId =
        getStringValue(item, ["processId", "processNumber", "externalCaseNumber"]) ??
        "";
      const escritorio =
        getStringValue(item, ["escritorio", "office", "firm"]) ?? "—";
      const previsto = getNumberValue(item, ["previsto", "forecast", "planned"]);
      const real = getNumberValue(item, ["real", "actual", "observed"]);
      const variancia =
        getStringValue(item, ["variancia", "variance", "varianceLabel"]) ?? "—";
      const status = getStringValue(item, ["status"]) ?? "OK";

      if (!caseId || !processId || previsto === null || real === null) {
        return null;
      }

      return {
        caseId,
        processId,
        escritorio,
        previsto,
        real,
        variancia,
        status,
      };
    })
    .filter((item): item is AuditRow => item !== null);

  return mapped.length > 0 ? mapped : null;
}

function mapKpis(raw: unknown): DashboardKpi[] | null {
  if (!isRecord(raw)) {
    return null;
  }

  const summary = getRecordValue(raw, ["summary"]);
  const adherence = getRecordValue(raw, ["adherence"]);
  const effectiveness = getRecordValue(raw, ["effectiveness"]);

  const mapped = [...defaultKpis];
  let changed = false;

  const adherenceValue =
    getNumberValue(adherence, ["value", "rate", "percentage"]) ??
    getNumberValue(summary, ["taxaAderencia", "adherenceRate"]);
  const adherenceTrend =
    getStringValue(adherence, ["trend"]) ??
    getStringValue(summary, ["adherenceTrend"]) ??
    mapped[0].trend;

  if (adherenceValue !== null) {
    mapped[0] = {
      ...mapped[0],
      value: formatPercent(adherenceValue),
      trend: adherenceTrend,
      direction: deriveDirection(adherenceTrend, mapped[0].direction),
    };
    changed = true;
  }

  const economyValue =
    getNumberValue(summary, [
      "economiaGerada",
      "savings",
      "economyGenerated",
      "savingAmount",
    ]) ?? getNumberValue(raw, ["economiaGerada"]);
  const economyTrend =
    getStringValue(summary, ["economiaTrend", "savingsTrend"]) ?? mapped[1].trend;

  if (economyValue !== null) {
    mapped[1] = {
      ...mapped[1],
      value: formatCurrencyCompact(economyValue),
      trend: economyTrend,
      direction: deriveDirection(economyTrend, mapped[1].direction),
    };
    changed = true;
  }

  const closingTimeValue =
    getNumberValue(summary, [
      "tempoMedioFechamento",
      "averageClosingTimeDays",
      "closingTimeDays",
    ]) ?? getNumberValue(raw, ["tempoMedioFechamento"]);
  const closingTimeTrend =
    getStringValue(summary, ["closingTimeTrend", "tempoTrend"]) ?? mapped[2].trend;

  if (closingTimeValue !== null) {
    mapped[2] = {
      ...mapped[2],
      value: `${Math.round(closingTimeValue)} dias`,
      trend: closingTimeTrend,
      direction: deriveDirection(closingTimeTrend, mapped[2].direction),
    };
    changed = true;
  }

  const effectivenessValue =
    getNumberValue(effectiveness, ["value", "rate", "percentage"]) ??
    getNumberValue(summary, ["efetividade", "effectivenessRate"]);
  const effectivenessTrend =
    getStringValue(effectiveness, ["trend"]) ??
    getStringValue(summary, ["effectivenessTrend"]) ??
    mapped[3].trend;

  if (effectivenessValue !== null) {
    mapped[3] = {
      ...mapped[3],
      value: formatPercent(effectivenessValue),
      trend: effectivenessTrend,
      direction: deriveDirection(effectivenessTrend, mapped[3].direction),
    };
    changed = true;
  }

  return changed ? mapped : null;
}

export function DashboardPage() {
  // Dashboard page purpose: apresentar métricas consolidadas, gráficos de variação e a auditoria de processos divergentes.
  const navigate = useNavigate();
  const varianceChart = useChartWidth();
  const divergenceChart = useChartWidth();
  const [kpis, setKpis] = useState(defaultKpis);
  const [varianceData, setVarianceData] = useState(defaultVarianceData);
  const [divergenceData, setDivergenceData] = useState(defaultDivergenceData);
  const [divergenceCaseCount, setDivergenceCaseCount] = useState(
    defaultDivergenceCaseCount,
  );
  const [auditRows, setAuditRows] = useState(defaultAuditRows);

  useEffect(() => {
    let isActive = true;

    void getDashboardAnalytics().then((response) => {
      if (!isActive || !response) {
        return;
      }

      const nextKpis = mapKpis(response);
      const nextVariance = mapVarianceData(response);
      const nextDivergence = mapDivergenceData(response);
      const nextCaseCount = mapDivergenceCaseCount(response);
      const nextAuditRows = mapAuditRows(response);

      if (nextKpis) {
        setKpis(nextKpis);
      }

      if (nextVariance) {
        setVarianceData(nextVariance);
      }

      if (nextDivergence) {
        setDivergenceData(nextDivergence);
      }

      if (typeof nextCaseCount === "number") {
        setDivergenceCaseCount(nextCaseCount);
      }

      if (nextAuditRows) {
        setAuditRows(nextAuditRows);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="page-card p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a2e]">
              Dashboard
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Acompanhe as métricas gerais dos seus processos.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <Filter className="h-4 w-4 text-slate-400" />
                Escritório
              </span>
              <Select defaultValue="all" options={officeOptions} />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Tipo de Ação
              </span>
              <Select defaultValue="all" options={actionOptions} />
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const positive = item.direction === "up";

          return (
            <div key={item.label} className="page-card p-5">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e]">
                {item.value}
              </p>
              <div
                className={[
                  "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                  positive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600",
                ].join(" ")}
              >
                {positive ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {item.trend}
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="page-card p-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a2e]">
              Análise de Variância de Custo
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Custo Judicial Previsto vs. Custo Real de Acordo (R$ Milhões)
            </p>
          </div>

          <div ref={varianceChart.ref} className="mt-6 h-80 min-w-0">
            {varianceChart.width > 0 ? (
              <BarChart
                barGap={8}
                data={varianceData}
                height={320}
                width={varianceChart.width}
              >
                <XAxis
                  axisLine={false}
                  dataKey="month"
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickFormatter={(value: number) => `${value}`}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [
                    `R$ ${formatTooltipValue(value, " mi")}`,
                    "Valor",
                  ]}
                  labelStyle={{ color: "#1a1a2e", fontWeight: 600 }}
                />
                <Legend />
                <Bar
                  dataKey="previsto"
                  fill="#d7dce7"
                  name="Custo Previsto"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="real"
                  fill="#0f2044"
                  name="Custo Real"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            ) : null}
          </div>
        </div>

        <div className="page-card p-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a2e]">
              Motivos de Divergência
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Distribuição dos fatores de variação
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div ref={divergenceChart.ref} className="relative h-72 min-w-0">
              {divergenceChart.width > 0 ? (
                <PieChart height={288} width={divergenceChart.width}>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={divergenceData}
                    dataKey="value"
                    innerRadius={72}
                    outerRadius={112}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {divergenceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${formatTooltipValue(value, "%")}`,
                      "Participação",
                    ]}
                  />
                </PieChart>
              ) : null}

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#1a1a2e]">
                  {divergenceCaseCount}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  CASES
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {divergenceData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-[8px] border border-border-soft bg-[#fbfcfe] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#1a1a2e]">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a2e]">
              Processos Divergentes
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Revisão detalhada de casos que excederam os limites de
              tolerância.
            </p>
          </div>

          <Button onClick={() => exportAuditCsv(auditRows)} variant="secondary">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        <div className="mt-6 overflow-hidden rounded-[8px] border border-border-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-soft text-left">
              <thead className="bg-[#f8fafc]">
                <tr className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-4 py-3 font-semibold">PROCESSO ID</th>
                  <th className="px-4 py-3 font-semibold">ESCRITÓRIO</th>
                  <th className="px-4 py-3 font-semibold">PREVISTO (R$)</th>
                  <th className="px-4 py-3 font-semibold">REAL (R$)</th>
                  <th className="px-4 py-3 font-semibold">VARIÂNCIA</th>
                  <th className="px-4 py-3 font-semibold">STATUS</th>
                  <th className="px-4 py-3 font-semibold">AÇÃO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft bg-white">
                {auditRows.map((row) => (
                  <tr key={row.caseId}>
                    <td className="px-4 py-4 text-sm font-medium text-[#1a1a2e]">
                      {row.processId}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.escritorio}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {formatCurrency(row.previsto)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {formatCurrency(row.real)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-700">
                      {row.variancia}
                    </td>
                    <td className="px-4 py-4">
                      <Badge tone={row.status === "OK" ? "success" : "warning"}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        onClick={() => navigate(`/resultado/${row.caseId}`)}
                        size="sm"
                        variant="secondary"
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

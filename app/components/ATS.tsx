import { cn } from "~/lib/utils";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  const rating =
    score > 69
      ? {
          icon: `${import.meta.env.BASE_URL}icons/ats-good.svg`,
          subtitle: "Great job!",
          badge: "bg-green-100 text-green-800",
        }
      : score > 49
        ? {
            icon: `${import.meta.env.BASE_URL}icons/ats-warning.svg`,
            subtitle: "Good start",
            badge: "bg-amber-100 text-amber-900",
          }
        : {
            icon: `${import.meta.env.BASE_URL}icons/ats-bad.svg`,
            subtitle: "Needs improvement",
            badge: "bg-red-100 text-red-800",
          };

  return (
    <section className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img src={rating.icon} alt="" className="size-10 shrink-0" />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
              ATS Score
            </h2>
            <p className="mt-0.5 text-sm text-slate-600">{rating.subtitle}</p>
          </div>
        </div>

        <span
          className={cn(
            "shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold tabular-nums",
            rating.badge,
          )}
        >
          {score}/100
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        This score estimates how well your resume may perform in applicant
        tracking systems used by employers.
      </p>

      {suggestions.length > 0 && (
        <ul className="mt-4 space-y-2">
          {suggestions.map((suggestion, index) => {
            const isGood = suggestion.type === "good";

            return (
              <li
                key={`${suggestion.tip}-${index}`}
                className={cn(
                  "flex min-w-0 items-start gap-2.5 rounded-xl border px-3 py-2.5",
                  isGood
                    ? "border-green-200 bg-green-50 text-green-900"
                    : "border-amber-200 bg-amber-50 text-amber-900",
                )}
              >
                <img
                  src={`${import.meta.env.BASE_URL}icons/${isGood ? "check.svg" : "warning.svg"}`}
                  alt={isGood ? "Strength" : "Needs improvement"}
                  className="mt-0.5 size-4 shrink-0"
                />
                <p className="min-w-0 text-sm leading-5 [overflow-wrap:anywhere]">
                  {suggestion.tip}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default ATS;

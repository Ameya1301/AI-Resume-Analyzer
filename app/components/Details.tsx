import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

type FeedbackTip = {
  type: "good" | "improve";
  tip: string;
  explanation: string;
};

const ScoreBadge = ({ score }: { score: number }) => {
  const isHighScore = score > 69;
  const colors = isHighScore
    ? "bg-badge-green text-badge-green-text"
    : score > 39
      ? "bg-badge-yellow text-badge-yellow-text"
      : "bg-badge-red text-badge-red-text";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-medium tabular-nums",
        colors,
      )}
    >
      <img
        src={`${import.meta.env.BASE_URL}icons/${isHighScore ? "check.svg" : "warning.svg"}`}
        alt=""
        className="size-4 shrink-0"
      />
      {score}/100
    </span>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-3 py-1 pr-2 text-left">
      <span className="min-w-0 break-words text-base font-semibold leading-snug text-slate-900 sm:text-lg">
        {title}
      </span>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({ tips }: { tips: FeedbackTip[] }) => {
  if (tips.length === 0) {
    return <p className="text-sm text-slate-600">No tips for this category.</p>;
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tips.map((tip, index) => {
          const isGood = tip.type === "good";

          return (
            <li
              key={`${tip.tip}-${index}`}
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
              <span className="min-w-0 text-sm font-medium leading-5 [overflow-wrap:anywhere]">
                {tip.tip}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="flex min-w-0 flex-col gap-3">
        {tips.map((tip, index) => {
          const isGood = tip.type === "good";

          return (
            <div
              key={`${tip.tip}-${index}`}
              className={cn(
                "flex min-w-0 flex-col gap-2 rounded-xl border p-4",
                isGood
                  ? "border-green-200 bg-green-50"
                  : "border-amber-200 bg-amber-50",
              )}
            >
              <div className="flex min-w-0 items-start gap-2">
                <img
                  src={`${import.meta.env.BASE_URL}icons/${isGood ? "check.svg" : "warning.svg"}`}
                  alt={isGood ? "Strength" : "Needs improvement"}
                  className="mt-0.5 size-4 shrink-0"
                />
                <p
                  className={cn(
                    "min-w-0 text-sm font-semibold [overflow-wrap:anywhere] sm:text-base",
                    isGood ? "text-green-800" : "text-amber-900",
                  )}
                >
                  {tip.tip}
                </p>
              </div>

              <p className="text-sm leading-6 text-slate-700 [overflow-wrap:anywhere]">
                {tip.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  const categories = [
    { id: "tone-style", title: "Tone & Style", data: feedback.toneAndStyle },
    { id: "content", title: "Content", data: feedback.content },
    { id: "structure", title: "Structure", data: feedback.structure },
    { id: "skills", title: "Skills", data: feedback.skills },
  ];

  return (
    <div className="w-full min-w-0">
      <Accordion>
        {categories.map(({ id, title, data }) => (
          <div
            key={id}
            className="mb-3 rounded-2xl border border-slate-200 bg-white shadow-sm last:mb-0"
          >
            <AccordionItem id={id}>
              <AccordionHeader itemId={id}>
                <CategoryHeader title={title} categoryScore={data.score} />
              </AccordionHeader>

              <AccordionContent itemId={id}>
                <div className="px-4 pb-4 sm:px-5">
                  <CategoryContent tips={data.tips} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>
    </div>
  );
};

export default Details;

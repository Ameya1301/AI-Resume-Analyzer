import { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

interface ResumeCardProps {
  resume: Resume;
  onDelete: (resume: Resume) => Promise<void>;
}

const ResumeCard = ({ resume, onDelete }: ResumeCardProps) => {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let previewUrl = "";

    setResumeUrl("");

    const loadPreview = async () => {
      try {
        const blob = await fs.read(imagePath);
        if (cancelled || !blob) return;

        previewUrl = URL.createObjectURL(blob);
        setResumeUrl(previewUrl);
      } catch (error) {
        console.error("Could not load resume preview:", error);
      }
    };

    void loadPreview();

    return () => {
      cancelled = true;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [fs, imagePath]);

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      await onDelete(resume);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative w-fit max-w-full">
      <Link
        to={`/resume/${id}`}
        className="resume-card animate-in fade-in duration-1000"
      >
        <div className="resume-card-header pr-8">
          <div className="flex flex-col gap-2">
            {companyName && (
              <h2 className="text-black! font-bold break-words">
                {companyName}
              </h2>
            )}
            {jobTitle && (
              <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
            )}
            {!companyName && !jobTitle && (
              <h3 className="text-black! font-bold">Resume</h3>
            )}
          </div>

          <div className="shrink-0">
            <ScoreCircle score={feedback.overallScore} />
          </div>
        </div>

        {resumeUrl && (
          <div className="gradient-border animate-in fade-in duration-1000">
            <div className="h-full w-full">
              <img
                src={resumeUrl}
                alt="Resume preview"
                className="h-[300px] w-full object-cover object-top max-sm:h-[150px]"
              />
            </div>
          </div>
        )}
      </Link>

      <button
        type="button"
        aria-label={`Delete resume${companyName ? ` for ${companyName}` : ""}`}
        title="Delete resume"
        disabled={isDeleting}
        onClick={handleDeleteClick}
        className="group absolute top-3 right-3 z-10 grid size-8 cursor-pointer place-items-center rounded-lg bg-gray-100 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-wait disabled:opacity-50"
      >
        <span
          aria-hidden="true"
          className="text-xl leading-none text-gray-500 group-hover:text-red-600"
        >
          ×
        </span>
      </button>
    </div>
  );
};

export default ResumeCard;

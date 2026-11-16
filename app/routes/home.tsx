import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "resume analyzer" },
    { name: "description", content: "Analyze your resume with AI!" },
  ];
}

export default function Home() {
  const { auth, isLoading, kv, fs } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      void navigate("/auth?next=/");
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  useEffect(() => {
    if (isLoading || !auth.isAuthenticated) return;

    let cancelled = false;

    const loadResumes = async () => {
      setLoadingResumes(true);
      setLoadError("");

      try {
        const savedResumes = (await kv.list("resume:*", true)) as
          | KVItem[]
          | undefined;
        if (!savedResumes)
          throw new Error("Puter did not return a resume list.");

        if (!cancelled) {
          setResumes(
            savedResumes.map(({ value }) => JSON.parse(value) as Resume),
          );
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Could not load resumes:", error);
        setLoadError("Could not load your resumes. Refresh the page to retry.");
      } finally {
        if (!cancelled) setLoadingResumes(false);
      }
    };

    void loadResumes();

    return () => {
      cancelled = true;
    };
  }, [isLoading, auth.isAuthenticated, kv]);

  const handleDeleteResume = async (resume: Resume) => {
    if (!window.confirm("Delete this resume and its feedback?")) return;

    setDeleteError("");

    try {
      const deleted = await kv.delete(`resume:${resume.id}`);
      if (!deleted) throw new Error("Puter did not confirm the deletion.");
    } catch (error) {
      console.error("Could not delete resume:", error);
      setDeleteError("Could not delete this resume. Please try again.");
      return;
    }

    setResumes((current) => current.filter((item) => item.id !== resume.id));

    try {
      await Promise.all([
        fs.delete(resume.resumePath),
        fs.delete(resume.imagePath),
      ]);
    } catch (error) {
      console.error("Could not delete resume files:", error);
      setDeleteError(
        "The resume was removed from your list, but its PDF or preview may still be in Puter.",
      );
    }
  };

  const isEmpty = !loadingResumes && !loadError && resumes.length === 0;

  return (
    <main
      className="bg-cover"
      style={{
        backgroundImage: `url("${import.meta.env.BASE_URL}images/bg-main.svg")`,
      }}
    >
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications &amp; Resume Ratings</h1>
          {isEmpty ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {(loadError || deleteError) && (
          <p role="alert" className="mb-4 text-center text-sm text-red-700">
            {loadError || deleteError}
          </p>
        )}

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img
              src={`${import.meta.env.BASE_URL}images/resume-scan-2.gif`}
              alt="Loading resumes"
              className="w-[200px]"
            />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={handleDeleteResume}
              />
            ))}
          </div>
        )}

        {isEmpty && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

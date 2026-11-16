import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constansts";
export function meta() {
  return [{ title: "Upload Resume | Resume Analyzer" }];
}
const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setSetText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };
  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setSetText("Uploading the File...");
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile) return setSetText("Error: Failed to upload the file");
    setSetText("Converting to image...");

    const imageFile = await convertPdfToImage(file).catch((error) => {
      console.error("PDF conversion threw an error:", error);
      return null;
    });

    if (!imageFile?.file) {
      console.error("PDF conversion result:", imageFile);
      setSetText("Error: Failed to convert PDF to image");
      return;
    }

    setSetText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);

    // const imageFile = await convertPdfToImage(file);
    // if (!imageFile.file)
    //   return setSetText("Error: Failed to Convert PDF to image");
    // setSetText("Uploading the image...");

    // const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setSetText("Error: Failed to upload the image");
    setSetText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setSetText("Analysis in progress...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription }),
    );
    if (!feedback) return setSetText("Error: Failed to get feedback");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;
    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setSetText("Analysis complete, redirecting...");
    console.log(data);
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };
  return (
    <main
      className="bg-cover"
      style={{
        backgroundImage: `url("${import.meta.env.BASE_URL}images/bg-main.svg")`,
      }}
    >
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-4">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src={`${import.meta.env.BASE_URL}images/resume-scan.gif`}
                className="w-full"
                alt=""
              />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips </h2>
          )}
        </div>
        {!isProcessing && (
          <form
            id="upload-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            <div className="form-div">
              <label htmlFor="company-name">Company Name</label>
              <input
                type="text"
                name="company-name"
                placeholder="Company Name"
                id="company-name"
              />
            </div>

            <div className="form-div">
              <label htmlFor="job-title">Job Title</label>
              <input
                type="text"
                name="job-title"
                placeholder="Job Title"
                id="job-title"
              />
            </div>

            <div className="form-div">
              <label htmlFor="job-description">Job Description</label>
              <textarea
                rows={5}
                name="job-description"
                placeholder="Job Description"
                id="job-description"
              />
            </div>

            <div className="form-div">
              <label htmlFor="uploader">Upload Resume</label>
              <FileUploader file={file} onFileSelect={handleFileSelect} />
            </div>
            <button className="primary-button" type="submit">
              Analyze Resume
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Upload;

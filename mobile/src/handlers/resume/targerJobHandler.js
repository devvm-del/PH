export const targetJobHandler = ({
  resumeId,

  jobTitle,
  selectedIndustry,
  jobDescription,

  setJobTitle,
  setSelectedIndustry,
  setJobDescription,

  setJobTitleError,
  setSelectedIndustryError,
  setJobDescriptionError,

  getById,
  saveTarget,
  navigation,
}) => {
  // LOAD EXISTING RESUME
  const loadTargetJobResume = async () => {
    try {
      const result = await getById(resumeId);

      if (result.success && result.resume) {
        const targetJob = result.resume.targetJob;

        if (targetJob) {
          setJobTitle(targetJob.jobTitle || "");

          setSelectedIndustry(targetJob.industry || "");

          setJobDescription(targetJob.jobDescription || "");
        }
      }
    } catch (error) {
      console.log("Load target job error:", error);
    }
  };

  // NEXT BUTTON
  const handleTargetJobNext = async () => {
    try {
      // Clear previous errors
      setJobTitleError("");
      setSelectedIndustryError("");
      setJobDescriptionError("");

      const result = await saveTarget(resumeId, {
        jobTitle,
        industry: selectedIndustry,
        jobDescription,
      });

      if (!result.success) {
        const validationErrors = result.errors || {};

        setJobTitleError(validationErrors.jobTitle || "");

        setSelectedIndustryError(validationErrors.industry || "");

        setJobDescriptionError(validationErrors.jobDescription || "");

        console.log("Validation errors:", validationErrors);

        return;
      }

      navigation.navigate("WorkExperience", {
        resumeId,
      });
    } catch (error) {
      console.log("Target job handler error:", error);
    }
  };

  return {
    loadTargetJobResume,
    handleTargetJobNext,
  };
};

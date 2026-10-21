export const summaryExtrasHandler = ({
  resumeId,

  professionalSummary,
  skills,
  certificates,
  projects,

  setProfessionalSummary,
  setSkills,
  setCertificates,
  setProjects,
  setErrors,

  setProfessionalSummaryError,
  setSkillsError,
  setCertificatesError,

  setGeneratingSummary,
  setGeneratingResume,

  getById,
  saveSummary,
  generateProfessionalSummary,
  optimizeResume,

  setModalMessage,
  setModalVisible,

  navigation,
}) => {
  const loadSummaryExtrasResume = async () => {
    try {
      const result = await getById(resumeId);

      if (!result.success || !result.resume) {
        return;
      }

      const resume = result.resume;

      // PROFESSIONAL SUMMARY
      setProfessionalSummary(resume.professionalSummary || "");

      // SKILLS
      setSkills(resume.skills || "");

      // CERTIFICATES
      setCertificates(resume.certificates || "");

      // PROJECTS
      if (resume.projects && resume.projects.length > 0) {
        setProjects(
          resume.projects.map((project) => ({
            ...project,

            id: project._id || Date.now() + Math.random(),

            expanded: false,
          })),
        );
      }
    } catch (error) {
      console.log("Load summary extras error:", error);
    }
  };

  const addProject = () => {
    // Maximum of 5 projects
    if (projects.length >= 5) {
      return;
    }

    setProjects((prev) => [
      ...prev.map((project) => ({
        ...project,
        expanded: false,
      })),

      {
        id: Date.now() + Math.random(),
        projectName: "",
        projectDescription: "",
        expanded: true,
      },
    ]);
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));

    setErrors((prev) => {
      const updatedErrors = {
        ...prev,
      };

      delete updatedErrors[`${id}_projectName`];

      delete updatedErrors[`${id}_projectDescription`];

      return updatedErrors;
    });
  };

  const updateProject = (id, field, value) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              [field]: value,
            }
          : project,
      ),
    );

    setErrors((prev) => ({
      ...prev,
      [`${id}_${field}`]: "",
    }));
  };

  const toggleProject = (id) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              expanded: !project.expanded,
            }
          : project,
      ),
    );
  };

  const handleGenerateSummary = async () => {
    try {
      setGeneratingSummary(true);

      const result = await generateProfessionalSummary(resumeId);

      if (!result.success) {
        setModalMessage(result.message);
        setModalVisible(true);

        return;
      }

      setProfessionalSummary(result.summary || "");

      setProfessionalSummaryError("");
    } catch (error) {
      setModalMessage(error.message);
      setModalVisible(true);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleSummaryExtrasNext = async () => {
    try {
      setGeneratingResume(true);

      // Clear previous errors
      setProfessionalSummaryError("");
      setSkillsError("");
      setCertificatesError("");
      setErrors({});

      const dataToSave = projects.map(
        ({ id, _id, expanded, ...project }) => project,
      );

      const result = await saveSummary(resumeId, {
        professionalSummary,
        skills,
        certificates,
        projects: dataToSave,
      });

      if (!result.success) {
        const validationErrors = result.errors || {};

        setProfessionalSummaryError(validationErrors.professionalSummary || "");

        setSkillsError(validationErrors.skills || "");

        setCertificatesError(validationErrors.certificates || "");

        setErrors(validationErrors);

        return;
      }

      const resumeResult = await getById(resumeId);

      if (!resumeResult.success || !resumeResult.resume) {
        console.log("Failed to fetch resume:", resumeResult.message);

        return;
      }

      const resume = resumeResult.resume;

      if (resume.aiOptimization) {
        console.log("AI optimization already exists. Skipping optimization.");

        navigation.navigate("AiGeneratedResume", {
          resumeId,
        });

        return;
      }

      console.log("AI optimization does not exist. Generating...");

      const optimizeResult = await optimizeResume(resumeId);

      if (!optimizeResult.success) {
        console.log("Resume optimization failed:", optimizeResult.message);
        setModalMessage(optimizeResult.message);
        setModalVisible(true);

        return;
      }

      navigation.navigate("AiGeneratedResume", {
        resumeId,
      });
    } catch (error) {
      console.log("Summary & Extras handler error:", error);
      setModalMessage(error.message);
      setModalVisible(true);
    } finally {
      setGeneratingResume(false);
    }
  };

  return {
    loadSummaryExtrasResume,
    addProject,
    deleteProject,
    updateProject,
    toggleProject,
    handleGenerateSummary,
    handleSummaryExtrasNext,
  };
};

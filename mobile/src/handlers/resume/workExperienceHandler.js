export const workExperienceHandler = ({
  resumeId,

  noWorkExperience,
  setNoWorkExperience,

  workExperiences,
  setWorkExperiences,
  setErrors,

  getById,
  saveExperience,

  navigation,
}) => {
  // LOAD EXISTING RESUME
  const loadWorkExperienceResume = async () => {
    try {
      const result = await getById(resumeId);

      if (result.success && result.resume) {
        // Load checkbox value
        setNoWorkExperience(result.resume.noWorkExperience === true);

        // Load existing work experiences
        if (
          result.resume.workExperiences &&
          result.resume.workExperiences.length > 0
        ) {
          setWorkExperiences(
            result.resume.workExperiences.map((experience) => {
              let startDate = "";
              let endDate = "";

              if (experience.periodOfEmployment) {
                const parts = experience.periodOfEmployment.split(" - ");

                if (parts.length === 2) {
                  startDate = parts[0].trim();

                  const savedEnd = parts[1].trim();

                  if (savedEnd.toLowerCase() !== "present") {
                    endDate = savedEnd;
                  }
                } else {
                  startDate = experience.periodOfEmployment.trim();
                }
              }

              return {
                ...experience,

                id: experience._id || Date.now() + Math.random(),

                startDate,
                endDate,

                currentlyWorking:
                  experience.currentlyWorking === true ||
                  (experience.periodOfEmployment &&
                    experience.periodOfEmployment
                      .toLowerCase()
                      .includes("present")),

                expanded: false,
              };
            }),
          );
        }
      }
    } catch (error) {
      console.log("Load work experience error:", error);
    }
  };

  // ADD WORK EXPERIENCE
  const addWorkExperience = () => {
    if (workExperiences.length >= 5) {
      return;
    }

    setWorkExperiences((prev) => [
      ...prev.map((experience) => ({
        ...experience,
        expanded: false,
      })),

      {
        id: Date.now() + Math.random(),

        jobTitle: "",
        company: "",
        location: "",

        currentlyWorking: false,

        periodOfEmployment: "",

        description: "",

        startDate: "",
        endDate: "",

        expanded: true,
      },
    ]);
  };

  // DELETE WORK EXPERIENCE
  const deleteWorkExperience = (id) => {
    setWorkExperiences((prev) =>
      prev.filter((experience) => experience.id !== id),
    );
  };

  // UPDATE WORK EXPERIENCE
  const updateWorkExperience = (id, index, field, value) => {
    setWorkExperiences((prev) =>
      prev.map((experience) =>
        experience.id === id
          ? {
              ...experience,
              [field]: value,
            }
          : experience,
      ),
    );

    // Clear field error
    setErrors((prev) => {
      const updatedErrors = {
        ...prev,
      };

      delete updatedErrors[`experience.${index}.${field}`];

      delete updatedErrors[`workExperiences.${index}.${field}`];

      if (field === "startDate" || field === "endDate") {
        delete updatedErrors[`experience.${index}.periodOfEmployment`];
      }

      return updatedErrors;
    });
  };

  // TOGGLE WORK EXPERIENCE
  const toggleWorkExperience = (id) => {
    setWorkExperiences((prev) =>
      prev.map((experience) =>
        experience.id === id
          ? {
              ...experience,
              expanded: !experience.expanded,
            }
          : experience,
      ),
    );
  };

  // VALIDATE DATES
  const validateWorkExperienceDates = () => {
    // No work experience selected
    // so date validation is not needed
    if (noWorkExperience) {
      return true;
    }

    const dateErrors = {};

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    workExperiences.forEach((experience, index) => {
      if (
        experience.startDate &&
        experience.endDate &&
        !experience.currentlyWorking
      ) {
        const startParts = experience.startDate.split(" ");

        const endParts = experience.endDate.split(" ");

        if (startParts.length === 2 && endParts.length === 2) {
          const startMonth = months.indexOf(startParts[0]);

          const startYear = Number(startParts[1]);

          const endMonth = months.indexOf(endParts[0]);

          const endYear = Number(endParts[1]);

          if (startMonth !== -1 && endMonth !== -1 && startYear && endYear) {
            const startValue = startYear * 12 + startMonth;

            const endValue = endYear * 12 + endMonth;

            if (endValue < startValue) {
              dateErrors[`experience.${index}.endDate`] =
                "End date cannot be earlier than start date.";
            }
          }
        }
      }
    });

    setErrors((prev) => ({
      ...prev,
      ...dateErrors,
    }));

    return Object.keys(dateErrors).length === 0;
  };

  // VALIDATE REQUIRED WORK EXPERIENCE FIELDS
  const validateWorkExperienceFields = () => {
    if (noWorkExperience) {
      return true;
    }

    const validationErrors = {};

    // At least one work experience is required
    if (workExperiences.length === 0) {
      validationErrors.workExperiences =
        "Please add at least one work experience.";

      setErrors(validationErrors);

      return false;
    }

    workExperiences.forEach((experience, index) => {
      if (!experience.jobTitle || !experience.jobTitle.trim()) {
        validationErrors[`experience.${index}.jobTitle`] =
          "Job title is required";
      }

      if (!experience.company || !experience.company.trim()) {
        validationErrors[`experience.${index}.company`] = "Company is required";
      }

      if (!experience.location || !experience.location.trim()) {
        validationErrors[`experience.${index}.location`] =
          "Location is required";
      }

      // Period of employment
      if (
        !experience.startDate ||
        (!experience.endDate && !experience.currentlyWorking)
      ) {
        validationErrors[`experience.${index}.periodOfEmployment`] =
          "Period of employment is required";
      }
    });

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const buildPeriodOfEmployment = (experience) => {
    const start = experience.startDate || "";

    if (!start) {
      return "";
    }

    if (experience.currentlyWorking) {
      return `${start} - Present`;
    }

    if (experience.endDate) {
      return `${start} - ${experience.endDate}`;
    }

    return start;
  };

  // NEXT BUTTON
  const handleWorkExperienceNext = async () => {
    try {
      if (noWorkExperience) {
        const result = await saveExperience(resumeId, [], true);

        if (!result.success) {
          setErrors(result.errors || {});
          return;
        }

        navigation.navigate("Education", {
          resumeId,
        });

        return;
      }

      // Validate required fields FIRST
      const fieldsValid = validateWorkExperienceFields();

      if (!fieldsValid) {
        return;
      }

      // Validate dates SECOND
      const datesValid = validateWorkExperienceDates();

      if (!datesValid) {
        return;
      }

      // Prepare data for backend
      const dataToSave = workExperiences.map((experience) => ({
        jobTitle: experience.jobTitle || "",

        company: experience.company || "",

        location: experience.location || "",

        periodOfEmployment: buildPeriodOfEmployment(experience),

        currentlyWorking: experience.currentlyWorking === true,

        description: experience.description || "",
      }));

      const result = await saveExperience(resumeId, dataToSave, false);

      if (!result.success) {
        setErrors(result.errors || {});
        return;
      }

      navigation.navigate("Education", {
        resumeId,
      });
    } catch (error) {
      console.log("Work experience handler error:", error);
    }
  };

  return {
    loadWorkExperienceResume,
    addWorkExperience,
    deleteWorkExperience,
    updateWorkExperience,
    toggleWorkExperience,
    handleWorkExperienceNext,
  };
};

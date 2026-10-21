import AsyncStorage from "@react-native-async-storage/async-storage";

const loadDraft = async () => {
  try {
    const result = await getDraft();

    if (result.success && result.resume) {
      const resume = result.resume;

      setResumeId(resume._id);

      await AsyncStorage.setItem("resumeId", resume._id);

      if (resume.basicInfo) {
        setFullName(resume.basicInfo.fullName || "");
        setContactNumber(resume.basicInfo.contactNumber || "");
        setAddress(resume.basicInfo.address || "");
        setEmail(resume.basicInfo.email || "");
        setLinkedInURL(resume.basicInfo.linkedInURL || "");
        setPortfolioLink(resume.basicInfo.portfolioLink || "");
      }
    }
  } catch (error) {
    console.log("Load draft error:", error);
  }
};

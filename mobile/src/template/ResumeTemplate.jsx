import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";

const ResumeTemplate = ({ resume, template, preview = false }) => {
  const selectedTemplate = template || resume?.template;

  switch (selectedTemplate) {
    case "modern":
      return <ModernTemplate resume={resume} preview={preview} />;

    case "professional":
      return <ProfessionalTemplate resume={resume} preview={preview} />;

    case "minimal":
      return <MinimalTemplate resume={resume} preview={preview} />;

    case "classic":
    default:
      return <ClassicTemplate resume={resume} preview={preview} />;
  }
};

export default ResumeTemplate;

const puppeteer = require("puppeteer");

const escapeHTML = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatText = (value) => {
  return escapeHTML(value || "").replace(/\n/g, "<br />");
};

const getContactInfo = (resume) => {
  const basic = resume.basicInfo || {};

  const contact = [];

  if (basic.email) {
    contact.push(escapeHTML(basic.email));
  }

  if (basic.contactNumber) {
    contact.push(escapeHTML(basic.contactNumber));
  }

  if (basic.address) {
    contact.push(escapeHTML(basic.address));
  }

  if (basic.linkedInURL) {
    contact.push(escapeHTML(basic.linkedInURL));
  }

  if (basic.portfolioLink) {
    contact.push(escapeHTML(basic.portfolioLink));
  }

  return contact.join(" | ");
};

const renderWorkExperience = (resume) => {
  const experiences = resume.workExperiences || [];

  if (experiences.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>WORK EXPERIENCE</h2>

      ${experiences
        .map(
          (experience) => `
          <div class="experience">
            <div class="row">
              <div class="left">
                <div class="job-title">
                  ${escapeHTML(experience.jobTitle)}
                </div>

                <div class="company">
                  ${escapeHTML(experience.company)}
                </div>
              </div>

              <div class="right">
                ${escapeHTML(experience.location)}
              </div>
            </div>

            <div class="row">
              <div class="left"></div>

              <div class="right">
                ${escapeHTML(experience.periodOfEmployment)}
              </div>
            </div>

            ${
              experience.description
                ? `
                <div class="description">
                  ${formatText(experience.description)}
                </div>
              `
                : ""
            }
          </div>
        `,
        )
        .join("")}
    </section>
  `;
};

const renderEducation = (resume) => {
  const educations = resume.educations || [];

  if (educations.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>EDUCATION</h2>

      ${educations
        .map(
          (education) => `
          <div class="education">
            <div class="row">
              <div class="left">
                <div class="degree">
                  ${escapeHTML(education.degreeField)}
                </div>

                <div class="school">
                  ${escapeHTML(education.school)}
                </div>
              </div>

              <div class="right">
                ${escapeHTML(education.location)}
              </div>
            </div>

            <div class="row">
              <div class="left"></div>

              <div class="right">
                ${escapeHTML(education.schoolYear)}
              </div>
            </div>

            ${
              education.description
                ? `
                <div class="description">
                  ${formatText(education.description)}
                </div>
              `
                : ""
            }
          </div>
        `,
        )
        .join("")}
    </section>
  `;
};

const renderSkills = (resume) => {
  if (!resume.skills) {
    return "";
  }

  return `
    <section>
      <h2>SKILLS</h2>
      <div class="content">
        ${formatText(resume.skills)}
      </div>
    </section>
  `;
};

const renderCertificates = (resume) => {
  if (!resume.certificates) {
    return "";
  }

  return `
    <section>
      <h2>CERTIFICATES</h2>
      <div class="content">
        ${formatText(resume.certificates)}
      </div>
    </section>
  `;
};

const renderProjects = (resume) => {
  const projects = resume.projects || [];

  if (projects.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>PROJECTS</h2>

      ${projects
        .map(
          (project) => `
          <div class="project">
            <div class="project-name">
              ${escapeHTML(project.projectName)}
            </div>

            ${
              project.projectDescription
                ? `
                <div class="description">
                  ${formatText(project.projectDescription)}
                </div>
              `
                : ""
            }
          </div>
        `,
        )
        .join("")}
    </section>
  `;
};

const renderSummary = (resume) => {
  if (!resume.professionalSummary) {
    return "";
  }

  return `
    <section>
      <h2>PROFESSIONAL SUMMARY</h2>

      <div class="content">
        ${formatText(resume.professionalSummary)}
      </div>
    </section>
  `;
};

/*
========================================
CLASSIC
========================================
*/

const classicTemplate = (resume) => {
  return `
    <div class="page classic">
      <header class="header">
        <h1>${escapeHTML(resume.basicInfo?.fullName || "Your Name")}</h1>

        ${
          resume.targetJob?.jobTitle
            ? `<div class="target">${escapeHTML(
                resume.targetJob.jobTitle,
              )}</div>`
            : ""
        }

        <div class="contact">
          ${getContactInfo(resume)}
        </div>
      </header>

      ${renderSummary(resume)}
      ${renderWorkExperience(resume)}
      ${renderEducation(resume)}
      ${renderSkills(resume)}
      ${renderProjects(resume)}
      ${renderCertificates(resume)}
    </div>
  `;
};

/*
========================================
MINIMAL
========================================
*/

const minimalTemplate = (resume) => {
  return `
    <div class="page minimal">
      <header class="header">
        <h1>${escapeHTML(resume.basicInfo?.fullName || "Your Name")}</h1>

        ${
          resume.targetJob?.jobTitle
            ? `<div class="target">${escapeHTML(
                resume.targetJob.jobTitle,
              )}</div>`
            : ""
        }

        <div class="contact">
          ${getContactInfo(resume)}
        </div>
      </header>

      ${renderSummary(resume)}
      ${renderWorkExperience(resume)}
      ${renderEducation(resume)}
      ${renderSkills(resume)}
      ${renderProjects(resume)}
      ${renderCertificates(resume)}
    </div>
  `;
};

/*
========================================
MODERN
========================================
*/

const modernTemplate = (resume) => {
  return `
    <div class="page modern">
      <header class="header">
        <h1>${escapeHTML(resume.basicInfo?.fullName || "Your Name")}</h1>

        ${
          resume.targetJob?.jobTitle
            ? `<div class="target">${escapeHTML(
                resume.targetJob.jobTitle,
              )}</div>`
            : ""
        }

        <div class="contact">
          ${getContactInfo(resume)}
        </div>
      </header>

      ${renderSummary(resume)}
      ${renderWorkExperience(resume)}
      ${renderEducation(resume)}
      ${renderSkills(resume)}
      ${renderProjects(resume)}
      ${renderCertificates(resume)}
    </div>
  `;
};

/*
========================================
PROFESSIONAL
========================================
*/

const professionalTemplate = (resume) => {
  return `
    <div class="page professional">
      <header class="header">
        <h1>${escapeHTML(resume.basicInfo?.fullName || "Your Name")}</h1>

        ${
          resume.targetJob?.jobTitle
            ? `<div class="target">${escapeHTML(
                resume.targetJob.jobTitle,
              )}</div>`
            : ""
        }

        <div class="contact">
          ${getContactInfo(resume)}
        </div>
      </header>

      ${renderSummary(resume)}
      ${renderWorkExperience(resume)}
      ${renderEducation(resume)}
      ${renderSkills(resume)}
      ${renderProjects(resume)}
      ${renderCertificates(resume)}
    </div>
  `;
};

const generateResumeHTML = (resume) => {
  const template = resume.template || "classic";

  let content;

  switch (template) {
    case "minimal":
      content = minimalTemplate(resume);
      break;

    case "modern":
      content = modernTemplate(resume);
      break;

    case "professional":
      content = professionalTemplate(resume);
      break;

    case "classic":
    default:
      content = classicTemplate(resume);
      break;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <style>
          @page {
            size: A4;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background: white;
            color: #111111;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10.5pt;
            line-height: 1.45;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm 16mm;
            background: white;
          }

          .header {
            margin-bottom: 18px;
          }

          h1 {
            margin: 0;
            font-size: 25px;
            line-height: 1.2;
            font-weight: 700;
          }

          .target {
            margin-top: 4px;
            font-size: 12px;
            font-weight: 600;
          }

          .contact {
            margin-top: 8px;
            font-size: 9px;
            line-height: 1.5;
            overflow-wrap: anywhere;
          }

          section {
            margin-top: 17px;
          }

          h2 {
            margin: 0 0 8px 0;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.8px;
          }

          .content {
            font-size: 10px;
          }

          .row {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: flex-start;
            gap: 15px;
          }

          .left {
            flex: 1;
            min-width: 0;
          }

          .right {
            width: 155px;
            flex-shrink: 0;
            text-align: right;
            font-size: 9px;
          }

          .job-title,
          .degree,
          .project-name {
            font-weight: 700;
            font-size: 10.5px;
          }

          .company,
          .school {
            font-size: 10px;
            margin-top: 2px;
          }

          .description {
            margin-top: 6px;
            font-size: 9.7px;
            line-height: 1.45;
          }

          .experience,
          .education,
          .project {
            margin-bottom: 12px;
            page-break-inside: avoid;
          }

          .classic h2 {
            border-bottom: 1px solid #111111;
            padding-bottom: 3px;
          }

          .classic .header {
            border-bottom: 1px solid #111111;
            padding-bottom: 10px;
          }

          .minimal {
            padding-top: 18mm;
          }

          .minimal .header {
            margin-bottom: 22px;
          }

          .minimal h2 {
            font-size: 10px;
            letter-spacing: 1.2px;
          }

          .minimal section {
            margin-top: 18px;
          }

          .modern .header {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 12px;
          }

          .modern h2 {
            color: #2563eb;
            border-bottom: 1px solid #dddddd;
            padding-bottom: 4px;
          }

          .professional .header {
            border-bottom: 2px solid #111111;
            padding-bottom: 11px;
          }

          .professional h2 {
            background: #f2f2f2;
            padding: 5px 7px;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>

      <body>
        ${content}
      </body>
    </html>
  `;
};

const generateResumePDF = async (resume) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    const html = generateResumeHTML(resume);

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    return pdf;
  } finally {
    await browser.close();
  }
};

module.exports = {
  generateResumePDF,
};

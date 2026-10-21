require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Resume = require("../models/resume");
const MockInterview = require("../models/mockInterview");
const AuditLog = require("../models/auditLog");

// Fills the database with sample users, resumes and interviews so the admin
// dashboard has something to show.
//
//   node scripts/seedDemoData.js            add the sample data
//   node scripts/seedDemoData.js --remove   delete the sample data again
//
// Sample accounts all use an email ending in @demo.prephired.test, so they
// are easy to tell apart from real users. Their password is Demo12345.

const DEMO_DOMAIN = "@demo.prephired.test";
const DAY_MS = 24 * 60 * 60 * 1000;

// Small seeded random generator, so every run produces the same data
let seed = 20261014;
const random = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const pick = (list) => list[Math.floor(random() * list.length)];
const between = (min, max) => Math.floor(random() * (max - min + 1)) + min;
const daysAgo = (days) =>
  new Date(Date.now() - days * DAY_MS - between(0, 20) * 60 * 60 * 1000);

const NAMES = [
  "Maria Santos",
  "Juan Dela Cruz",
  "Angela Reyes",
  "Mark Villanueva",
  "Katrina Lim",
  "Paolo Garcia",
  "Bianca Ramos",
  "Rafael Mendoza",
  "Sofia Navarro",
  "Carlo Bautista",
  "Jasmine Cruz",
  "Miguel Torres",
  "Elena Castillo",
  "Nathan Flores",
];

const JOBS = [
  "Software Engineer",
  "Software Engineer",
  "Web Developer",
  "Data Analyst",
  "UX Designer",
  "Project Manager",
  "Customer Support Specialist",
];

const INDUSTRIES = ["Technology", "Finance", "Education", "Retail"];
const TEMPLATES = ["classic", "modern", "professional", "minimal"];
const CATEGORIES = ["Behavioral", "Technical", "HR Screening", "All"];

const score = (min, max) => between(min, max);

const removeDemoData = async () => {
  const demoUsers = await User.find({
    email: { $regex: `${DEMO_DOMAIN.replace(".", "\\.")}$` },
  }).select("_id");

  const ids = demoUsers.map((user) => user._id);

  const [resumes, interviews, users, logs] = await Promise.all([
    Resume.deleteMany({ userId: { $in: ids } }),
    MockInterview.deleteMany({ userId: { $in: ids } }),
    User.deleteMany({ _id: { $in: ids } }),
    AuditLog.deleteMany({
      $or: [
        { userId: { $in: ids } },
        { userEmail: { $regex: `${DEMO_DOMAIN.replace(".", "\\.")}$` } },
      ],
    }),
  ]);

  console.log(
    `Removed ${users.deletedCount} sample users, ${resumes.deletedCount} resumes, ${interviews.deletedCount} interviews and ${logs.deletedCount} audit log entries.`,
  );
};

const addDemoData = async () => {
  const existing = await User.countDocuments({
    email: { $regex: `${DEMO_DOMAIN.replace(".", "\\.")}$` },
  });

  if (existing > 0) {
    console.log(
      "Sample data is already in the database. Run with --remove first if you want to add it again.",
    );
    return;
  }

  const password = await bcrypt.hash("Demo12345", 10);

  let resumeCount = 0;
  let interviewCount = 0;

  const auditLogs = [];
  // Keeps sample events from landing in the future
  const notAfterNow = (time) =>
    new Date(Math.min(time, Date.now() - 60 * 1000));

  for (let i = 0; i < NAMES.length; i += 1) {
    const fullName = NAMES[i];
    const [firstName, ...rest] = fullName.split(" ");
    const joined = daysAgo(between(0, 13));
    const email = `${firstName}.${rest.join("")}${DEMO_DOMAIN}`.toLowerCase();

    const user = await User.create({
      firstName,
      lastName: rest.join(" "),
      fullName,
      email,
      password,
      role: "user",
      // Leave one account disabled so the "Disabled" filter has something to show
      isEnabled: i !== 5,
      termsAccepted: true,
      createdAt: joined,
      updatedAt: joined,
    });

    // Everything this user "did", for the audit log
    const log = (action, description, at, status = "success") =>
      auditLogs.push({
        userId: user._id,
        userName: fullName,
        userEmail: email,
        actorRole: "user",
        action,
        category: action.split(".")[0],
        description,
        status,
        ip: `203.0.113.${between(2, 250)}`,
        userAgent: "PrepHired mobile (Expo Go)",
        createdAt: notAfterNow(at),
      });

    log("auth.register", "Created an account", joined.getTime());

    for (let l = 0; l < between(1, 4); l += 1) {
      log("auth.login", "Logged in", joined.getTime() + between(1, 9) * 3600 * 1000 * (l + 1));
    }

    if (random() > 0.65) {
      log(
        "auth.login_failed",
        "Incorrect password",
        joined.getTime() + between(1, 5) * 3600 * 1000,
        "failure",
      );
    }

    // 1 to 2 resumes per user
    for (let r = 0; r < between(1, 2); r += 1) {
      const completed = random() > 0.35;
      const created = new Date(
        Math.min(joined.getTime() + between(0, 3) * DAY_MS, Date.now() - 60 * 60 * 1000),
      );

      await Resume.create({
        userId: user._id,
        basicInfo: { firstName, lastName: rest.join(" "), fullName, email },
        targetJob: { jobTitle: pick(JOBS), industry: pick(INDUSTRIES) },
        template: pick(TEMPLATES),
        status: completed ? "completed" : "draft",
        currentStep: completed ? 8 : between(2, 6),
        aiAnalysis: completed ? { atsScore: score(55, 94) } : {},
        createdAt: created,
        updatedAt: created,
      });

      log("resume.created", "Started a new resume", created.getTime());

      if (completed) {
        log("resume.completed", "Completed a resume", created.getTime() + 2 * 3600 * 1000);
      }

      resumeCount += 1;
    }

    // 0 to 3 mock interviews per user
    for (let n = 0; n < between(0, 3); n += 1) {
      const completed = random() > 0.25;
      const numberOfQuestions = pick([5, 8, 12]);
      const started = new Date(
        Math.min(joined.getTime() + between(0, 4) * DAY_MS, Date.now() - 60 * 60 * 1000),
      );

      const job = pick(JOBS);
      const category = pick(CATEGORIES);

      await MockInterview.create({
        userId: user._id,
        targetJob: job,
        interviewCategory: category,
        responseMode: pick(["Text", "Audio"]),
        numberOfQuestions,
        currentQuestion: completed ? numberOfQuestions : between(1, numberOfQuestions),
        status: completed ? "completed" : "in-progress",
        questions: Array.from({ length: numberOfQuestions }, (_, index) => ({
          questionNumber: index + 1,
          question: `Sample question ${index + 1}`,
        })),
        overallScore: completed ? score(55, 95) : 0,
        skillBreakdown: completed
          ? {
              communication: score(55, 95),
              technicalKnowledge: score(45, 92),
              problemSolving: score(50, 94),
              confidence: score(50, 92),
              relevance: score(55, 96),
            }
          : undefined,
        startedAt: started,
        completedAt: completed ? started : undefined,
        createdAt: started,
        updatedAt: started,
      });

      log(
        "interview.started",
        `Started a ${category} mock interview for ${job}`,
        started.getTime(),
      );

      if (completed) {
        log(
          "interview.completed",
          `Completed a mock interview for ${job}`,
          started.getTime() + 30 * 60 * 1000,
        );
      }

      interviewCount += 1;
    }
  }

  await AuditLog.insertMany(auditLogs);

  console.log(
    `Added ${NAMES.length} sample users, ${resumeCount} resumes, ${interviewCount} interviews and ${auditLogs.length} audit log entries.`,
  );
};

const run = async () => {
  if (!process.env.MONGODB_URI1) {
    console.log("MONGODB_URI1 is missing. Check backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI1);

    if (process.argv.includes("--remove")) {
      await removeDemoData();
    } else {
      await addDemoData();
    }
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();

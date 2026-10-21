import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useRoute } from "@react-navigation/native";

import ResumeHeader from "../../components/ResumeHeader";
import Button from "../../components/Button";
import { Ionicons } from "@expo/vector-icons";

import styles from "../../styles/global";

import useResume from "../../hooks/useResume";

const AiGeneratedResume1 = ({ navigation }) => {
  const route = useRoute();

  const { resumeId } = route.params;

  const {
    getById,
    analyzeResume,
    optimizeResume,
    applyResumeOptimization,
    loading,
  } = useResume();

  const [resume, setResume] = useState(null);

  const [hasOptimized, setHasOptimized] = useState(false);

  const [viewMode, setViewMode] = useState("analysis");

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const result = await getById(resumeId);

      if (result.success && result.resume) {
        setResume(result.resume);

        setHasOptimized(!!result.resume.aiOptimization);
      }
    } catch (error) {
      console.log("Load AI resume error:", error);
    }
  };

  const handleAnalyze = async () => {
    try {
      const result = await analyzeResume(resumeId);

      console.log("FRONTEND ANALYZE RESULT:", JSON.stringify(result, null, 2));

      if (!result.success) {
        console.log("Analyze failed:", result.message);

        return;
      }

      if (result.resume) {
        console.log("ATS SCORE:", result.resume.aiAnalysis?.atsScore);

        setResume(result.resume);
      }
    } catch (error) {
      console.log("Analyze resume error:", error);
    }
  };

  const handleOptimize = async () => {
    try {
      const result = await optimizeResume(resumeId);

      console.log("FRONTEND OPTIMIZATION:", JSON.stringify(result, null, 2));

      if (!result.success) {
        console.log("Optimization failed:", result.message);

        return;
      }

      if (result.resume) {
        setResume(result.resume);
      }

      setHasOptimized(true);

      setViewMode("comparison");
    } catch (error) {
      console.log("Optimize resume error:", error);
    }
  };

  const handleApplyOptimization = async () => {
    try {
      const result = await applyResumeOptimization(resumeId);

      if (!result.success) {
        console.log("Apply optimization failed:", result.message);

        return;
      }

      if (result.resume) {
        setResume(result.resume);
      }

      navigation.navigate("ChooseTemplate", {
        resumeId,
      });
    } catch (error) {
      console.log("Apply optimization error:", error);
    }
  };

  const handleKeepOriginal = () => {
    navigation.navigate("ChooseTemplate", {
      resumeId,
    });
  };

  if (!resume) {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#2563EB" />

          <Text
            style={{
              color: "#71717A",
              marginTop: 10,
            }}
          >
            Loading AI review...
          </Text>
        </View>
      </View>
    );
  }

  const aiAnalysis = resume.aiAnalysis || {};

  const atsScore =
    typeof aiAnalysis.atsScore === "number" ? aiAnalysis.atsScore : 0;

  const strengths = aiAnalysis.strengths || [];

  const missingKeywords = aiAnalysis.missingKeywords || [];

  const matchingKeywords = aiAnalysis.matchingKeywords || [];

  const recommendations = aiAnalysis.recommendations || [];

  const experienceAnalysis = aiAnalysis.experienceAnalysis || "";

  const educationAnalysis = aiAnalysis.educationAnalysis || "";

  const skillsAnalysis = aiAnalysis.skillsAnalysis || "";

  const projectAnalysis = aiAnalysis.projectAnalysis || "";

  const certificateAnalysis = aiAnalysis.certificateAnalysis || "";

  const aiOptimization = resume.aiOptimization || null;

  const renderComparison = (title, original, optimized, reason, icon) => {
    return (
      <View
        style={{
          backgroundColor: "#25252F",
          borderRadius: 12,
          padding: 16,
          marginBottom: 15,
        }}
      >
        {/* TITLE */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Ionicons name={icon} size={20} color="#2563EB" />

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 16,
              fontWeight: "600",
              marginLeft: 8,
            }}
          >
            {title}
          </Text>
        </View>

        {/* SIDE BY SIDE */}

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 280,
                backgroundColor: "#1E1E27",
                borderRadius: 10,
                padding: 14,
                borderWidth: 1,
                borderColor: "#3F3F46",
              }}
            >
              <Text
                style={{
                  color: "#A1A1AA",
                  fontSize: 12,
                  fontWeight: "700",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                Original
              </Text>

              <Text
                style={{
                  color: "#E4E4E7",
                  fontSize: 14,
                  lineHeight: 21,
                }}
              >
                {original || "No content provided."}
              </Text>
            </View>

            <View
              style={{
                width: 280,
                backgroundColor: "#172033",
                borderRadius: 10,
                padding: 14,
                borderWidth: 1,
                borderColor: "#2563EB",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="sparkles" size={14} color="#2563EB" />

                <Text
                  style={{
                    color: "#60A5FA",
                    fontSize: 12,
                    fontWeight: "700",
                    marginLeft: 6,
                    textTransform: "uppercase",
                  }}
                >
                  AI Optimized
                </Text>
              </View>

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 14,
                  lineHeight: 21,
                }}
              >
                {optimized || "No optimized content."}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* WHY */}

        <View
          style={{
            marginTop: 12,
            backgroundColor: "#1E1E27",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Ionicons name="help-circle-outline" size={17} color="#F59E0B" />

            <Text
              style={{
                color: "#FCD34D",
                fontSize: 13,
                fontWeight: "600",
                marginLeft: 6,
              }}
            >
              Why AI changed this
            </Text>
          </View>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            {reason || "No specific change was necessary."}
          </Text>
        </View>
      </View>
    );
  };

  const renderWorkExperience = () => {
    if (!aiOptimization?.workExperiences?.length) {
      return null;
    }

    return aiOptimization.workExperiences.map((experience, index) =>
      renderComparison(
        experience.company
          ? `${experience.jobTitle} - ${experience.company}`
          : `Work Experience ${index + 1}`,
        experience.original,
        experience.optimized,
        experience.reason,
        "briefcase-outline",
      ),
    );
  };

  const renderEducation = () => {
    if (!aiOptimization?.educations?.length) {
      return null;
    }

    return aiOptimization.educations.map((education, index) =>
      renderComparison(
        education.school
          ? `${education.degreeField} - ${education.school}`
          : `Education ${index + 1}`,
        education.original,
        education.optimized,
        education.reason,
        "school-outline",
      ),
    );
  };

  const renderProjects = () => {
    if (!aiOptimization?.projects?.length) {
      return null;
    }

    return aiOptimization.projects.map((project, index) =>
      renderComparison(
        project.projectName || `Project ${index + 1}`,
        project.original,
        project.optimized,
        project.reason,
        "folder-open-outline",
      ),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResumeHeader
          navigation={navigation}
          resumeLabel="AI Generated Resume"
          resumeId={resumeId}
          navigateTo="SummaryExtras"
        />

        <Text
          style={{
            textAlign: "center",
            color: "#F8FAFC",
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          6/8
        </Text>

        <View
          style={{
            backgroundColor: "#25252F",
            width: "100%",
            height: 8,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <View
            style={[
              styles.percent,
              {
                width: "75%",
              },
            ]}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 25,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 45,
              height: 45,
              borderRadius: 23,
              backgroundColor: "#25252F",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name="sparkles" size={23} color="#2563EB" />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 20,
                fontWeight: "700",
              }}
            >
              AI Generated Resume
            </Text>

            <Text
              style={{
                color: "#71717A",
                fontSize: 13,
                marginTop: 3,
              }}
            >
              Review your resume and see how AI improves it
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#25252F",
            borderRadius: 10,
            padding: 4,
            marginBottom: 18,
          }}
        >
          <TouchableOpacity
            onPress={() => setViewMode("analysis")}
            style={{
              flex: 1,
              paddingVertical: 11,
              borderRadius: 8,
              alignItems: "center",
              backgroundColor:
                viewMode === "analysis" ? "#2563EB" : "transparent",
            }}
          >
            <Text
              style={{
                color: viewMode === "analysis" ? "#FFFFFF" : "#A1A1AA",
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              AI Analysis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (hasOptimized) {
                setViewMode("comparison");
              }
            }}
            disabled={!hasOptimized}
            style={{
              flex: 1,
              paddingVertical: 11,
              borderRadius: 8,
              alignItems: "center",
              backgroundColor:
                viewMode === "comparison" ? "#2563EB" : "transparent",
              opacity: hasOptimized ? 1 : 0.4,
            }}
          >
            <Text
              style={{
                color: viewMode === "comparison" ? "#FFFFFF" : "#A1A1AA",
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              Original vs AI
            </Text>
          </TouchableOpacity>
        </View>

        {/* ======================================
            AI ANALYSIS
        ====================================== */}

        {viewMode === "analysis" && (
          <>
            {/* ATS SCORE */}

            <View
              style={{
                backgroundColor: "#25252F",
                borderRadius: 12,
                padding: 16,
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                }}
              >
                <Ionicons
                  name="speedometer-outline"
                  size={20}
                  color="#2563EB"
                />

                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 16,
                    fontWeight: "600",
                    marginLeft: 8,
                  }}
                >
                  ATS Score
                </Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 42,
                    fontWeight: "700",
                  }}
                >
                  {atsScore}

                  <Text
                    style={{
                      color: "#71717A",
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    /100
                  </Text>
                </Text>

                <Text
                  style={{
                    color: "#71717A",
                    fontSize: 13,
                    marginTop: 3,
                  }}
                >
                  Overall resume compatibility
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#1E1E27",
                  height: 8,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${Math.min(Math.max(atsScore, 0), 100)}%`,
                    height: 8,
                    backgroundColor: "#2563EB",
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>

            {/* STRENGTHS */}

            <View
              style={{
                backgroundColor: "#25252F",
                borderRadius: 12,
                padding: 16,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 14,
                }}
              >
                ✓ Strengths
              </Text>

              {strengths.length > 0 ? (
                strengths.map((strength, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons name="checkmark" size={18} color="#22C55E" />

                    <Text
                      style={{
                        flex: 1,
                        color: "#E4E4E7",
                        fontSize: 14,
                        lineHeight: 21,
                        marginLeft: 8,
                      }}
                    >
                      {strength}
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={{
                    color: "#71717A",
                  }}
                >
                  No strengths identified.
                </Text>
              )}
            </View>

            {/* MATCHING KEYWORDS */}

            <View
              style={{
                backgroundColor: "#25252F",
                borderRadius: 12,
                padding: 16,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 12,
                }}
              >
                Matching Keywords
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {matchingKeywords.map((keyword, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#16291D",
                      borderWidth: 1,
                      borderColor: "#245C35",
                      borderRadius: 20,
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                    }}
                  >
                    <Text
                      style={{
                        color: "#86EFAC",
                        fontSize: 13,
                      }}
                    >
                      {keyword}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* MISSING KEYWORDS */}

            <View
              style={{
                backgroundColor: "#25252F",
                borderRadius: 12,
                padding: 16,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 12,
                }}
              >
                Missing Keywords
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {missingKeywords.map((keyword, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#2A2418",
                      borderWidth: 1,
                      borderColor: "#5C481F",
                      borderRadius: 20,
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                    }}
                  >
                    <Text
                      style={{
                        color: "#FCD34D",
                        fontSize: 13,
                      }}
                    >
                      {keyword}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* RECOMMENDATIONS */}

            <View
              style={{
                backgroundColor: "#25252F",
                borderRadius: 12,
                padding: 16,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 14,
                }}
              >
                Recommendations
              </Text>

              {recommendations.map((recommendation, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#2563EB",
                      fontSize: 18,
                    }}
                  >
                    •
                  </Text>

                  <Text
                    style={{
                      flex: 1,
                      color: "#E4E4E7",
                      fontSize: 14,
                      lineHeight: 21,
                      marginLeft: 8,
                    }}
                  >
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>

            {/* ANALYSIS SECTIONS */}

            {[
              {
                title: "Experience Analysis",
                value: experienceAnalysis,
                icon: "briefcase-outline",
              },
              {
                title: "Education Analysis",
                value: educationAnalysis,
                icon: "school-outline",
              },
              {
                title: "Skills Analysis",
                value: skillsAnalysis,
                icon: "construct-outline",
              },
              {
                title: "Project Analysis",
                value: projectAnalysis,
                icon: "folder-open-outline",
              },
              {
                title: "Certificate Analysis",
                value: certificateAnalysis,
                icon: "ribbon-outline",
              },
            ].map((item) => (
              <View
                key={item.title}
                style={{
                  backgroundColor: "#25252F",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 15,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name={item.icon} size={20} color="#2563EB" />

                  <Text
                    style={{
                      color: "#F8FAFC",
                      fontSize: 16,
                      fontWeight: "600",
                      marginLeft: 8,
                    }}
                  >
                    {item.title}
                  </Text>
                </View>

                <Text
                  style={{
                    color: "#A1A1AA",
                    fontSize: 14,
                    lineHeight: 21,
                  }}
                >
                  {item.value || "No analysis available."}
                </Text>
              </View>
            ))}

            {/* AI NOTICE */}

            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#1E1E27",
                borderRadius: 10,
                padding: 14,
                marginBottom: 15,
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#71717A"
              />

              <Text
                style={{
                  flex: 1,
                  color: "#71717A",
                  fontSize: 13,
                  lineHeight: 19,
                  marginLeft: 8,
                }}
              >
                AI only uses the information you provided. Review the analysis
                before generating the optimized resume.
              </Text>
            </View>

            {/* ANALYZE */}

            <TouchableOpacity
              onPress={handleAnalyze}
              disabled={loading}
              activeOpacity={0.7}
              style={{
                height: 48,
                borderWidth: 1,
                borderColor: "#2563EB",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginBottom: 15,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <Ionicons name="refresh-outline" size={19} color="#2563EB" />
              )}

              <Text
                style={{
                  color: "#2563EB",
                  fontSize: 14,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                {loading ? "Analyzing..." : "Analyze Again"}
              </Text>
            </TouchableOpacity>

            {/* OPTIMIZE */}

            <TouchableOpacity
              onPress={handleOptimize}
              disabled={loading}
              activeOpacity={0.7}
              style={{
                height: 52,
                backgroundColor: "#2563EB",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginBottom: 100,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="sparkles" size={19} color="#FFFFFF" />
              )}

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: "700",
                  marginLeft: 8,
                }}
              >
                {loading
                  ? "Optimizing Resume..."
                  : "Generate AI Optimized Resume"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {viewMode === "comparison" && aiOptimization && (
          <>
            {/* INTRO */}

            <View
              style={{
                backgroundColor: "#1E1E27",
                borderRadius: 10,
                padding: 14,
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <Ionicons name="sparkles" size={20} color="#2563EB" />

                <Text
                  style={{
                    flex: 1,
                    color: "#A1A1AA",
                    fontSize: 13,
                    lineHeight: 19,
                    marginLeft: 8,
                  }}
                >
                  Compare your original resume with the AI optimized version. AI
                  improvements are based only on information already provided.
                </Text>
              </View>
            </View>

            {/* SUMMARY */}

            {aiOptimization.professionalSummary &&
              renderComparison(
                "Professional Summary",
                aiOptimization.professionalSummary.original,
                aiOptimization.professionalSummary.optimized,
                aiOptimization.professionalSummary.reason,
                "document-text-outline",
              )}

            {/* WORK EXPERIENCE */}

            {renderWorkExperience()}

            {/* EDUCATION */}

            {renderEducation()}

            {/* SKILLS */}

            {aiOptimization.skills &&
              renderComparison(
                "Skills",
                aiOptimization.skills.original,
                aiOptimization.skills.optimized,
                aiOptimization.skills.reason,
                "construct-outline",
              )}

            {/* PROJECTS */}

            {renderProjects()}

            {/* CERTIFICATES */}

            {aiOptimization.certificates &&
              renderComparison(
                "Certificates",
                aiOptimization.certificates.original,
                aiOptimization.certificates.optimized,
                aiOptimization.certificates.reason,
                "ribbon-outline",
              )}

            {/* WHAT CHANGED */}

            <View
              style={{
                backgroundColor: "#25252F",
                borderRadius: 12,
                padding: 16,
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <Ionicons name="create-outline" size={20} color="#2563EB" />

                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 16,
                    fontWeight: "600",
                    marginLeft: 8,
                  }}
                >
                  What I Changed & Why
                </Text>
              </View>

              {aiOptimization.changes?.length > 0 ? (
                aiOptimization.changes.map((change, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#2563EB",
                        fontSize: 18,
                      }}
                    >
                      •
                    </Text>

                    <Text
                      style={{
                        flex: 1,
                        color: "#E4E4E7",
                        fontSize: 14,
                        lineHeight: 21,
                        marginLeft: 8,
                      }}
                    >
                      {change}
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={{
                    color: "#71717A",
                    fontSize: 13,
                  }}
                >
                  No major changes were made.
                </Text>
              )}
            </View>

            {/* WARNING */}

            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#2A2418",
                borderRadius: 10,
                padding: 14,
                marginBottom: 15,
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#F59E0B"
              />

              <Text
                style={{
                  flex: 1,
                  color: "#FCD34D",
                  fontSize: 13,
                  lineHeight: 19,
                  marginLeft: 8,
                }}
              >
                AI does not invent skills, experience, certifications,
                achievements, or qualifications. Review the changes before
                applying them.
              </Text>
            </View>

            {/* KEEP ORIGINAL */}

            <TouchableOpacity
              onPress={handleKeepOriginal}
              disabled={loading}
              activeOpacity={0.7}
              style={{
                height: 50,
                borderWidth: 1,
                borderColor: "#52525B",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: "#A1A1AA",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Keep Original Resume
              </Text>
            </TouchableOpacity>

            {/* APPLY */}

            <TouchableOpacity
              onPress={handleApplyOptimization}
              disabled={loading}
              activeOpacity={0.7}
              style={{
                height: 52,
                backgroundColor: "#2563EB",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginBottom: 100,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#FFFFFF"
                />
              )}

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: "700",
                  marginLeft: 8,
                }}
              >
                {loading ? "Applying..." : "Apply AI Optimization"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {viewMode === "analysis" && (
        <Button
          style={{
            marginBottom: 65,
          }}
          title="Continue to AI Optimization"
          onPress={handleOptimize}
          disabled={loading}
        />
      )}
    </View>
  );
};

export default AiGeneratedResume1;

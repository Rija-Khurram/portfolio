import { tool } from "ai";
import { z } from "zod";

export const scoreLead = tool({
  description:
    "Score a potential client lead based on their interest, budget, timeline, and project type.",

  inputSchema: z.object({
    interestLevel: z
      .enum(["low", "medium", "high"])
      .describe("How strongly the lead is interested in the service."),

    budgetRange: z
      .enum(["unknown", "low", "medium", "high"])
      .describe("The lead's approximate budget level."),

    timeline: z
      .enum(["unknown", "later", "soon", "urgent"])
      .describe("How soon the lead wants to start."),

    projectType: z
      .string()
      .min(1)
      .describe("The type of project or service the lead needs."),
  }),

  execute: async ({
    interestLevel,
    budgetRange,
    timeline,
    projectType,
  }) => {
    
    const interestScores = {
      low: 10,
      medium: 18,
      high: 25,
    };

    const budgetScores = {
      unknown: 5,
      low: 10,
      medium: 20,
      high: 30,
    };

    const timelineScores = {
      unknown: 5,
      later: 10,
      soon: 20,
      urgent: 25,
    };

    const score =
      interestScores[interestLevel] +
      budgetScores[budgetRange] +
      timelineScores[timeline] +
      15;

    let status;
    let recommendation;

    if (score >= 75) {
      status = "Hot Lead";
      recommendation = "Prioritize this lead and follow up soon.";
    } else if (score >= 50) {
      status = "Warm Lead";
      recommendation = "Continue qualification and follow up.";
    } else {
      status = "Cold Lead";
      recommendation = "Keep the lead in nurturing and gather more information.";
    }

    return {
      score,
      status,
      projectType,
      factors: {
        interest: interestLevel,
        budget: budgetRange,
        timeline,
      },
      recommendation,
    };
  },
});
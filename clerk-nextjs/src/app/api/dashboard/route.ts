import { NextResponse } from "next/server";
import type { DashboardDataType } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const mockData: DashboardDataType = {
      currentStreak: 5,
      longestStreak: 12,
      totalAnswers: 14,
      averageScore: 8.2,
      questionsLeftToday: 5,
      lastPracticeDate: new Date().toISOString(),
      recentAnswers: [
        {
          id: "ans1",
          content: "I used a hash map to track the indices of the complements. This reduces the time complexity to O(n).",
          score: 9,
          feedback: "Great approach using hash map.",
          createdAt: new Date().toISOString(),
          question: {
            id: "dsa_e_1",
            text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            category: "DSA",
            difficulty: "EASY",
            tags: ["Hash Table"]
          }
        },
        {
          id: "ans2",
          content: "I scheduled a 1-on-1 meeting where we actively listened to each other's technical concerns and compromised.",
          score: 10,
          feedback: "Perfect answer demonstrating empathy.",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          question: {
            id: "hr_1",
            text: "Tell me about a time you had a conflict with a teammate and how you resolved it.",
            category: "HR",
            difficulty: "EASY",
            tags: ["Conflict"]
          }
        },
        {
          id: "ans3",
          content: "I would use a base62 encoding for the short hashes and put a Redis cache in front of DynamoDB.",
          score: 8,
          feedback: "Solid architecture, good choice of components.",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          question: {
            id: "sys_1",
            text: "How would you design a URL shortener like bit.ly?",
            category: "SYSTEM_DESIGN",
            difficulty: "MEDIUM",
            tags: ["Architecture"]
          }
        }
      ]
    };

    return NextResponse.json(mockData);
  } catch (err) {
    return NextResponse.json<DashboardDataType>(
      {
        currentStreak: 0,
        longestStreak: 0,
        totalAnswers: 0,
        averageScore: null,
        questionsLeftToday: 5,
        lastPracticeDate: null,
        recentAnswers: [],
      },
      { status: 200 }
    );
  }
}
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = {
      total: 14,
      average: 8.2,
      currentStreak: 5,
      longestStreak: 12,
      bestScore: 10,
    };

    const d = new Date();
    d.setDate(d.getDate() - 14);

    const chartData = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(d);
      date.setDate(date.getDate() + i);
      chartData.push({
        date: date.toISOString().slice(0, 10),
        score: Math.round((7 + Math.random() * 2) * 10) / 10
      });
    }

    const categoryData = [
      { category: "DSA", avgScore: 8.1, count: 5 },
      { category: "HR", avgScore: 9.0, count: 3 },
      { category: "SYSTEM_DESIGN", avgScore: 7.5, count: 4 },
      { category: "BEHAVIORAL", avgScore: 8.8, count: 2 },
    ];

    const answers = [
      {
        id: "mock_ans_1",
        content: "I used a hash map to track the indices of the complements. This reduces the time complexity to O(n).",
        score: 9,
        feedback: JSON.stringify({ summary: "Excellent use of the hash map pattern for O(n) time complexity.", score: 9 }),
        createdAt: new Date().toISOString(),
        question: {
          id: "dsa_e_1",
          text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          category: "DSA",
          difficulty: "EASY",
          tags: ["Hash Table", "Array"]
        }
      },
      {
        id: "mock_ans_2",
        content: "I handled a conflict by scheduling a 1-on-1 meeting where we actively listened to each other's technical concerns and compromised on the architecture.",
        score: 10,
        feedback: JSON.stringify({ summary: "Perfect answer demonstrating empathy, active listening, and technical compromise.", score: 10 }),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        question: {
          id: "hr_1",
          text: "Tell me about a time you had a conflict with a teammate and how you resolved it.",
          category: "HR",
          difficulty: "EASY",
          tags: ["Conflict Resolution", "Teamwork"]
        }
      },
      {
        id: "mock_ans_3",
        content: "For a URL shortener, I would use a base62 encoding for the short hashes. I'd put a Redis cache in front of a NoSQL database like DynamoDB for fast reads.",
        score: 8,
        feedback: JSON.stringify({ summary: "Solid architecture. Consider discussing the collision handling of your base62 hashes.", score: 8 }),
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        question: {
          id: "sys_1",
          text: "How would you design a URL shortener like bit.ly?",
          category: "SYSTEM_DESIGN",
          difficulty: "MEDIUM",
          tags: ["System Design", "Caching"]
        }
      }
    ];

    return NextResponse.json({ stats, chartData, categoryData, answers });
  } catch {
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}

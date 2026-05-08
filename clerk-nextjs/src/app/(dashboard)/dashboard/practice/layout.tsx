import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice | Interview Prep AI",
  description: "Practice interview questions with a timer, submissions, and AI feedback.",
};

export default function PracticeSegmentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

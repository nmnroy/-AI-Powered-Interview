import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard | Interview Prep AI",
	description: "Review your streaks, recent answers, and quick actions from the dashboard.",
};

export default function DashboardSegmentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return children;
}
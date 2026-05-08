import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
	"/dashboard(.*)",
	"/api/answers(.*)",
	"/api/dashboard(.*)",
	"/api/feedback(.*)",
	"/api/generate-questions(.*)",
	"/api/progress(.*)",
	"/api/questions(.*)",
	"/api/user/sync(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
	if (isProtectedRoute(request)) {
		await auth.protect();
	}
});

export const config = {
	matcher: ["/((?!_next|.*\\..*).*)", "/api(.*)"],
};
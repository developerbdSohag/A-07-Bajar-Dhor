import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const isGoogleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_ID !== "google-client-id" &&
      process.env.GOOGLE_CLIENT_ID.trim().length > 0
  );

  const isGithubConfigured = Boolean(
    process.env.GITHUB_CLIENT_ID &&
      process.env.GITHUB_CLIENT_SECRET &&
      process.env.GITHUB_CLIENT_ID !== "github-client-id" &&
      process.env.GITHUB_CLIENT_ID.trim().length > 0
  );

  const baseUrl =
    process.env.BETTER_AUTH_URL ||
    (process.env.NODE_ENV === "production" || process.env.VERCEL
      ? "https://a-07-bajar-dhor.vercel.app"
      : "http://localhost:3000");

  return NextResponse.json({
    google: isGoogleConfigured,
    github: isGithubConfigured,
    callbacks: {
      google: `${baseUrl}/api/auth/callback/google`,
      github: `${baseUrl}/api/auth/callback/github`,
    },
  });
}

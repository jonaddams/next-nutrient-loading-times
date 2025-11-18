import { NextResponse } from "next/server";

/**
 * API Route: Generate Document Engine JWT Token
 *
 * This server-side endpoint generates JWT tokens for Nutrient Document Engine (DWS).
 * It keeps sensitive credentials secure on the server and prevents exposing them to clients.
 *
 * Best Practice: Always generate JWT tokens server-side to:
 * - Keep API keys and secrets secure
 * - Control token expiration and permissions
 * - Prevent unauthorized access to your Document Engine instance
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { documentId } = body;

		// Validate required environment variables
		const serverUrl = process.env.DOCUMENT_ENGINE_SERVER_URL;
		const apiKey = process.env.DOCUMENT_ENGINE_API_KEY;

		if (!serverUrl || !apiKey) {
			console.error("Missing Document Engine credentials");
			return NextResponse.json(
				{
					error: "Document Engine is not configured",
					details: "Missing DOCUMENT_ENGINE_SERVER_URL or DOCUMENT_ENGINE_API_KEY",
				},
				{ status: 500 },
			);
		}

		if (!documentId) {
			return NextResponse.json(
				{ error: "documentId is required" },
				{ status: 400 },
			);
		}

		// Generate session token using Nutrient Viewer API
		const sessionPayload = {
			allowed_documents: [
				{
					document_id: documentId,
					document_permissions: ["read", "write", "download"],
				},
			],
			exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
		};

		console.log("Requesting JWT from: https://api.nutrient.io/viewer/sessions");
		console.log("Document ID:", documentId);

		const response = await fetch("https://api.nutrient.io/viewer/sessions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(sessionPayload),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Session creation failed:", errorText);
			return NextResponse.json(
				{
					error: "Failed to create session",
					details: errorText,
				},
				{ status: response.status },
			);
		}

		const data = await response.json();

		// Ensure serverUrl has trailing slash for Web SDK
		const serverUrlWithSlash = serverUrl.endsWith("/")
			? serverUrl
			: `${serverUrl}/`;

		// Return the JWT token to the client
		return NextResponse.json({
			jwt: data.jwt,
			serverUrl: serverUrlWithSlash,
			documentId,
		});
	} catch (error) {
		console.error("Error generating Document Engine token:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

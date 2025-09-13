import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// GET /api/get-token
// Returns the value of the `token` cookie if it exists in an HTTP-only cookie.
export async function GET(req: NextRequest) {
    const cookieStore = cookies();
    // @ts-ignore
    const token = cookieStore.get("access-token")?.value ?? null; // change cookie name if different

    if (!token) {
        // No token cookie found – return a 204 No Content so the client can handle gracefully.
        return new Response("", { status: 204 });
    }

    // Send the raw token value back as plain text. This is safe because the cookie is HTTP-only
    // so the client cannot read it directly. The route acts as a secure proxy.
    return new Response(token, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "no-store",
        },
    });
}
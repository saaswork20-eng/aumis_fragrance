import { handlers } from "@/auth";

export const GET = handlers?.GET || (() => new Response("Auth not configured"));
export const POST = handlers?.POST || (() => new Response("Auth not configured"));

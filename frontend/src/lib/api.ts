import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { FounderIndexService } from "@/gen/founderindex/v1/founderindex_connect";

const transport = createConnectTransport({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

export const api = createClient(FounderIndexService, transport);

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function base64UrlEncode(data: string | Uint8Array): string {
  let text = "";
  if (typeof data === "string") {
    text = data;
  } else {
    text = String.fromCharCode(...data);
  }
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function signJwtRS256(header: Record<string, unknown>, payload: Record<string, unknown>, privateKeyPem: string): Promise<string> {
  const encoder = new TextEncoder();
  const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const data = `${encodedHeader}.${encodedPayload}`;

  const keyData = pemToArrayBuffer(privateKeyPem);
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    encoder.encode(data),
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signatureBuffer));
  return `${data}.${encodedSignature}`;
}

async function getAccessToken(serviceAccountEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jwt = await signJwtRS256(
    { alg: "RS256", typ: "JWT" },
    {
      iss: serviceAccountEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    },
    privateKey,
  );

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Falha ao obter token Google: ${errorText}`);
  }

  const tokenJson = await tokenResponse.json() as { access_token: string };
  return tokenJson.access_token;
}

async function appendRow({
  spreadsheetId,
  range,
  values,
  accessToken,
}: {
  spreadsheetId: string;
  range: string;
  values: (string | null)[];
  accessToken: string;
}): Promise<void> {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      values: [values],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao inserir na planilha: ${body}`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const env = Deno.env;
    const serviceAccountEmail = env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const rawPrivateKey = env.get("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
    const spreadsheetId = env.get("GOOGLE_SHEET_ID");
    const sheetRange = env.get("GOOGLE_SHEET_RANGE") ?? "Leads!A:E";

    if (!serviceAccountEmail || !rawPrivateKey || !spreadsheetId) {
      throw new Error("Variáveis de ambiente obrigatórias ausentes");
    }

    const { name, email, phone, source, message } = await req.json();

    if (!name || !email || !phone) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios ausentes" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

    const accessToken = await getAccessToken(serviceAccountEmail, privateKey);

    const values = [
      new Date().toISOString(),
      name,
      email,
      phone,
      source ?? null,
      message ?? null,
    ];

    await appendRow({
      spreadsheetId,
      range: sheetRange,
      values,
      accessToken,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Erro na função lead-to-sheet:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

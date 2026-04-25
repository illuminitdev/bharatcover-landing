import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export function getAllowedOrigin(
  event: APIGatewayProxyEvent,
  allowedCsv: string | undefined
): string {
  const allowed = (allowedCsv ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const requestOrigin = event.headers?.Origin ?? event.headers?.origin ?? '';
  if (requestOrigin && allowed.includes(requestOrigin)) {
    return requestOrigin;
  }
  return allowed[0] ?? 'https://www.bharatcover.net';
}

export function json(
  statusCode: number,
  body: unknown,
  event: APIGatewayProxyEvent,
  allowedOrigins?: string
): APIGatewayProxyResult {
  const origin = getAllowedOrigin(event, allowedOrigins ?? process.env.ALLOWED_ORIGINS);
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Guest-Session',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

export function parseJson<T>(event: APIGatewayProxyEvent): T | null {
  if (!event.body) return null;
  let raw = event.body;
  if (event.isBase64Encoded) {
    try {
      raw = Buffer.from(raw, 'base64').toString('utf8');
    } catch {
      return null;
    }
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

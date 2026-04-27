import type { APIGatewayProxyResult } from 'aws-lambda';

export function ok(data: unknown, statusCode = 200): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ success: true, data }),
  };
}

export function fail(message: string, statusCode = 400): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: false, error: message }),
  };
}

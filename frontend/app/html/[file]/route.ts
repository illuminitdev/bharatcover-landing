import { promises as fs } from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';

const HTML_DIR = path.join(process.cwd(), '.html');

const ALLOWED_FILES = new Set([
  'personal.html',
  'business.html',
  'health-insurance.html',
  'health-quote.html',
  'bharatcover_product_page_v2.html',
  'contact.html',
]);

function resolveHtmlFile(input: string): string | null {
  const normalized = input.endsWith('.html') ? input : `${input}.html`;
  return ALLOWED_FILES.has(normalized) ? normalized : null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> }
) {
  const { file } = await context.params;
  const resolved = resolveHtmlFile(file);

  if (!resolved) {
    notFound();
  }

  const filePath = path.join(HTML_DIR, resolved);
  const html = await fs.readFile(filePath, 'utf8');

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}


import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { PRODUCT_PAGE_FILES, type ProductPageFile } from '@/lib/product-pages';

const ALLOWED = new Set<string>(PRODUCT_PAGE_FILES);

function isAllowed(file: string): file is ProductPageFile {
  return ALLOWED.has(file);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> }
) {
  const { file } = await context.params;
  if (!isAllowed(file)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const fullPath = path.join(process.cwd(), 'product_pages', file);
  try {
    const html = await readFile(fullPath, 'utf-8');
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }
}

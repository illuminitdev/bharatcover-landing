import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { verifyAdminSession } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const admin = await verifyAdminSession(request);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const { isContacted } = body;

    if (typeof isContacted !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isContacted must be a boolean value' },
        { status: 400 }
      );
    }

    await dbConnect();

    const contact = await Contact.findByIdAndUpdate(
      id,
      { isContacted },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contact updated successfully',
        data: contact,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Update contact error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

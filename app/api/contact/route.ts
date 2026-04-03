import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const { companyName, contactPerson, email, phone, employees, product } = body;

    if (!companyName || !contactPerson || !email || !phone || !employees || !product) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Create new contact entry
    const contact = await Contact.create({
      companyName,
      contactPerson,
      email,
      phone,
      employees,
      product,
      message: body.message || '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your inquiry! We will contact you soon.',
        data: contact,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Contact form submission error:', error);

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

// GET endpoint to retrieve all contacts (optional - for admin use)
export async function GET() {
  try {
    await dbConnect();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json(
      {
        success: true,
        count: contacts.length,
        data: contacts,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Get contacts error:', error);

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

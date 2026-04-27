import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function verifyAdminSession(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie) {
      return null;
    }

    await dbConnect();
    const admin = await Admin.findById(sessionCookie.value);

    if (!admin) {
      return null;
    }

    return { id: admin._id.toString(), email: admin.email };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api/auth';

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = (searchParams.get('locale') as 'ar' | 'en') || 'en';

        const data = await request.json();
        const response = await authApi.resetPassword(data, locale);

        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to reset password' },
            { status: 400 }
        );
    }
}
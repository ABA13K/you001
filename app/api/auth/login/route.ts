/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = (searchParams.get('locale') as 'ar' | 'en') || 'en';

        const data = await request.json();
        const response = await authApi.login(data, locale);

        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        const message = error.message || 'Login failed';

        // Handle needs verification case
        if (message.includes('NEEDS_VERIFICATION:')) {
            const cleanMessage = message.replace('NEEDS_VERIFICATION:', '');
            return NextResponse.json(
                { message: cleanMessage },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message },
            { status: 400 }
        );
    }
}
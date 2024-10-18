import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const publicRoutes = ['/', '/login', '/signup'];

    const isPublicAsset = pathname.startsWith('/_next') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/fonts') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.svg');

    if (isPublicAsset) {
        return NextResponse.next();
    }

    if (!token && !publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        if (token) {
            const decodedToken = jwt.decode(token) as jwt.JwtPayload;
            const currentTime = Math.floor(Date.now() / 1000);

            if (!decodedToken || decodedToken.exp < currentTime) {
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.delete('token');
                return response;
            }
        }

        const response = NextResponse.next();
        if (token) {
            response.headers.set('x-user-authenticated', 'true');
        }
        return response;

    } catch (error) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
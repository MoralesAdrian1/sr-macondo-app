import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const user = request.cookies.get('user');

  if (!token || !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const parsedUser = JSON.parse(user);

  const protectedRoutes = {
    usuario: [
      'allPages/', 
      'allPages/carrito',
      'allPages/pedido',
      'allPages/historial',
      'allPages/payment',
    ],
    repartidor: [
      'allPages/repartidor',
      'allPages/repartidor/encargos',
    ],
    encargado: [
      'allPages/encargados',
      'allPages/encargados/encargos',
      'allPages/encargados/tacos',
      'allPages/encargados/tiendita/',
      'allPages/encargados/principal/',
      'allPages/encargados/guisados/',
      'allPages/encargados/pizza/',
      'allPages/encargados/fsodas/',
    ],
    admin: [
      'allPages/ingresos',
      'allPages/encargados',
      'allPages/encargados/encargos',
      'allPages/encargados/tacos',
      'allPages/encargados/tiendita/',
      'allPages/encargados/principal/',
      'allPages/encargados/guisados/',
      'allPages/encargados/pizza/',
      'allPages/encargados/fsodas/',
    ],
    superadmin: [
      'allPages/cruds/pedidos',
      'allPages/cruds/productos',
      'allPages/cruds/rol',
      'allPages/cruds/transacciones',
      'allPages/cruds/puesto',
    ],
  };

  const { pathname } = request.nextUrl;

  for (const [role, routes] of Object.entries(protectedRoutes)) {
    if (routes.some(route => pathname.startsWith(route)) && parsedUser.rol_id !== role) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/allPages/:path*',
    '/allPages/carrito',
    '/allPages/pedido',
    '/allPages/historial',
    '/allPages/payment',
    '/allPages/repartidor/:path*',
    '/allPages/encargados/:path*',
    '/allPages/ingresos',
    '/allPages/cruds/:path*',
  ], // Rutas protegidas
};

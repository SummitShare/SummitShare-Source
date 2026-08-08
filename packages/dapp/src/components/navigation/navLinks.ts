export type NavLink = Readonly<{ name: string; link: string }>;

export const NAV_LINKS: readonly NavLink[] = [
   { name: 'Home', link: '/' },
   { name: 'Exhibit', link: '/exhibit' },
   { name: 'Blog', link: '/blog' },
   { name: 'Support Us', link: '/donate' },
   { name: 'Insights', link: '/distribution' },
];

export const NAV_MENU_PAGES = NAV_LINKS;

export const SIGN_IN_LINK = '/auth-sign-in';
export const PROFILE_LINK = '/profile';

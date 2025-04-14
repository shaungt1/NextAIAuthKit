export const NAVIGATION_LINKS = [
    { href: '/', label: 'Home', protected: false },
  ];

export const NAVIGATION_LINKS_SECURE = [
    { href: '/', label: 'Home', protected: false },
    { href: '/examples', label: 'Examples', protected: false },
    { href: '/ai', label: 'AI Playground', protected: true },
    { href: '/c', label: 'AI Chat Window', protected: true },
    { href: '/admin', label: 'Admin Panel', protected: true, role: 'ADMIN' } // Admin only
];
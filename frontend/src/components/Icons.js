// Small hand-picked icon set so the app doesn't need an extra dependency.
// Each icon accepts a `size` prop (defaults to 18) and forwards other props (e.g. className).

const base = (size) => ({
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
});

export const IconGrid = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
);

export const IconUsers = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

export const IconCalendar = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);

export const IconBadge = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><rect x="4" y="3" width="16" height="18" rx="3" /><circle cx="12" cy="10" r="3" /><path d="M8 17.5c0-1.7 1.8-3 4-3s4 1.3 4 3" /></svg>
);

export const IconScan = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="4" y1="12" x2="20" y2="12" /></svg>
);

export const IconChart = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></svg>
);

export const IconLogout = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);

export const IconSearch = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);

export const IconCheck = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><polyline points="20 6 9 17 4 12" /></svg>
);

export const IconX = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

export const IconCamera = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
);

export const IconDownload = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
);

export const IconMail = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><polyline points="22 6 12 13 2 6" /></svg>
);

export const IconLock = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

export const IconArrowLeft = ({ size = 18, ...p }) => (
    <svg {...base(size)} {...p}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);

export const IconQr = ({ size = 40, ...p }) => (
    <svg {...base(size)} {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><line x1="14" y1="14" x2="14" y2="14.01" /><line x1="18" y1="14" x2="18" y2="18" /><line x1="14" y1="18" x2="14" y2="21" /><line x1="18" y1="21" x2="21" y2="21" /><line x1="21" y1="14" x2="21" y2="17" /></svg>
);

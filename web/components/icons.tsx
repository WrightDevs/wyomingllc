import type { ReactElement } from 'react';

export type IconName =
    | 'overview'
    | 'filings'
    | 'wallet'
    | 'account'
    | 'admin'
    | 'menu'
    | 'close'
    | 'arrow'
    | 'check'
    | 'copy'
    | 'search'
    | 'logout'
    | 'eye'
    | 'eyeOff'
    | 'building'
    | 'coins'
    | 'chevron'
    | 'alert'
    | 'shield'
    | 'lock'
    | 'refresh'
    | 'external';

type Props = { name: IconName; className?: string };

const paths: Record<IconName, ReactElement> = {
    overview: (
        <>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
    ),
    filings: (
        <>
            <path d="M7 3h7l4 4v14H7z" />
            <path d="M14 3v4h4" />
            <path d="M10 12h5M10 16h5" />
        </>
    ),
    wallet: (
        <>
            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5z" />
            <path d="M4 8h13" />
            <circle cx="16.5" cy="13.5" r="1" />
        </>
    ),
    account: (
        <>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.7-3.3 3.5-5.5 7-5.5s6.3 2.2 7 5.5" />
        </>
    ),
    admin: (
        <>
            <path d="M12 3 5 6v6c0 4.3 2.9 7.7 7 9 4.1-1.3 7-4.7 7-9V6z" />
            <path d="m9 12 2 2 4-4" />
        </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    check: <path d="m5 13 4 4L19 7" />,
    copy: (
        <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4H5.5A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
        </>
    ),
    logout: (
        <>
            <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
            <path d="M15 8l4 4-4 4M9 12h10" />
        </>
    ),
    eye: (
        <>
            <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.5" />
        </>
    ),
    eyeOff: (
        <>
            <path d="M4 4l16 16" />
            <path d="M9.5 9.5A2.5 2.5 0 0 0 12 14.5" />
            <path d="M6.5 6.9C4 8.4 2.5 12 2.5 12s3.5 6 9.5 6c1.6 0 3-.5 4.2-1.2" />
            <path d="M17.5 17.1c2.5-1.5 4-5.1 4-5.1s-3.5-6-9.5-6" />
        </>
    ),
    building: (
        <>
            <path d="M4 21V6l8-3 8 3v15" />
            <path d="M4 21h16M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1" />
        </>
    ),
    coins: (
        <>
            <ellipse cx="12" cy="6" rx="7" ry="3" />
            <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
            <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    alert: (
        <>
            <path d="M12 4 2.5 20h19z" />
            <path d="M12 10v4M12 17h.01" />
        </>
    ),
    shield: (
        <>
            <path d="M12 3 5 6v6c0 4.3 2.9 7.7 7 9 4.1-1.3 7-4.7 7-9V6z" />
            <path d="M9 12h6" />
        </>
    ),
    lock: (
        <>
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
    ),
    refresh: (
        <>
            <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5" />
            <path d="M20 4v4.5h-4.5" />
            <path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5" />
            <path d="M4 20v-4.5h4.5" />
        </>
    ),
    external: (
        <>
            <path d="M14 4h6v6" />
            <path d="M20 4 10 14" />
            <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </>
    )
};

export function Icon({ name, className = 'h-5 w-5' }: Props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
            focusable="false"
        >
            {paths[name]}
        </svg>
    );
}

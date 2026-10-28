export function formatDate(value: string | Date | null | undefined): string {
    if (!value) return '—';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function formatDateTime(value: string | Date | null | undefined): string {
    if (!value) return '—';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'UTC'
    });
}

export function initials(name: string, email = ''): string {
    const source = (name || email || '?').trim();
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return source.slice(0, 2).toUpperCase();
}

export function titleCase(value: string): string {
    return value.replace(/(^|[\s-])\w/g, (match) => match.toUpperCase());
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

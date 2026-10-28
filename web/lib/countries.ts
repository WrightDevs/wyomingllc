export type CountryOption = {
    code: string;
    name: string;
    dial_code: string;
    flag: string;
    placeholder: string;
};

export const COUNTRIES: CountryOption[] = [
    { code: 'US', name: 'United States', dial_code: '+1', flag: '🇺🇸', placeholder: '(XXX) XXX-XXXX' },
    { code: 'DE', name: 'Germany', dial_code: '+49', flag: '🇩🇪', placeholder: 'XXXX XXXXXXX' },
    { code: 'GB', name: 'United Kingdom', dial_code: '+44', flag: '🇬🇧', placeholder: 'XXXXX XXXXXX' },
    { code: 'CA', name: 'Canada', dial_code: '+1', flag: '🇨🇦', placeholder: '(XXX) XXX-XXXX' },
    { code: 'AU', name: 'Australia', dial_code: '+61', flag: '🇦🇺', placeholder: 'XXXX XXX XXX' },
    { code: 'FR', name: 'France', dial_code: '+33', flag: '🇫🇷', placeholder: 'XX XX XX XX XX' },
    { code: 'IT', name: 'Italy', dial_code: '+39', flag: '🇮🇹', placeholder: 'XXX XXX XXXX' },
    { code: 'ES', name: 'Spain', dial_code: '+34', flag: '🇪🇸', placeholder: 'XXX XX XX XX' },
    { code: 'NL', name: 'Netherlands', dial_code: '+31', flag: '🇳🇱', placeholder: 'XX XXXX XXXX' },
    { code: 'CH', name: 'Switzerland', dial_code: '+41', flag: '🇨🇭', placeholder: 'XX XXX XX XX' },
    { code: 'AT', name: 'Austria', dial_code: '+43', flag: '🇦🇹', placeholder: 'XXX XXXXXXX' },
    { code: 'BE', name: 'Belgium', dial_code: '+32', flag: '🇧🇪', placeholder: 'XXX XX XX XX' },
    { code: 'SE', name: 'Sweden', dial_code: '+46', flag: '🇸🇪', placeholder: 'XXX XXX XX XX' },
    { code: 'NO', name: 'Norway', dial_code: '+47', flag: '🇳🇴', placeholder: 'XXX XX XXX' },
    { code: 'DK', name: 'Denmark', dial_code: '+45', flag: '🇩🇰', placeholder: 'XX XX XX XX' },
    { code: 'FI', name: 'Finland', dial_code: '+358', flag: '🇫🇮', placeholder: 'XX XXX XXXX' },
    { code: 'JP', name: 'Japan', dial_code: '+81', flag: '🇯🇵', placeholder: 'XXX XXXX XXXX' },
    { code: 'KR', name: 'South Korea', dial_code: '+82', flag: '🇰🇷', placeholder: 'XXX XXXX XXXX' },
    { code: 'SG', name: 'Singapore', dial_code: '+65', flag: '🇸🇬', placeholder: 'XXXX XXXX' },
    { code: 'HK', name: 'Hong Kong', dial_code: '+852', flag: '🇭🇰', placeholder: 'XXXX XXXX' },
    { code: 'IN', name: 'India', dial_code: '+91', flag: '🇮🇳', placeholder: 'XXXXX XXXXX' },
    { code: 'NG', name: 'Nigeria', dial_code: '+234', flag: '🇳🇬', placeholder: 'XXX XXX XXXX' },
    { code: 'GH', name: 'Ghana', dial_code: '+233', flag: '🇬🇭', placeholder: 'XX XXX XXXX' },
    { code: 'KE', name: 'Kenya', dial_code: '+254', flag: '🇰🇪', placeholder: 'XXX XXXXXX' },
    { code: 'ZA', name: 'South Africa', dial_code: '+27', flag: '🇿🇦', placeholder: 'XX XXX XXXX' },
    { code: 'BR', name: 'Brazil', dial_code: '+55', flag: '🇧🇷', placeholder: '(XX) XXXX-XXXX' },
    { code: 'MX', name: 'Mexico', dial_code: '+52', flag: '🇲🇽', placeholder: 'XXX XXX XXXX' },
    { code: 'AR', name: 'Argentina', dial_code: '+54', flag: '🇦🇷', placeholder: 'XX XXXX-XXXX' },
    { code: 'AE', name: 'UAE', dial_code: '+971', flag: '🇦🇪', placeholder: 'XX XXX XXXX' },
    { code: 'SA', name: 'Saudi Arabia', dial_code: '+966', flag: '🇸🇦', placeholder: 'XX XXX XXXX' },
    { code: 'TR', name: 'Turkey', dial_code: '+90', flag: '🇹🇷', placeholder: 'XXX XXX XX XX' },
    { code: 'IL', name: 'Israel', dial_code: '+972', flag: '🇮🇱', placeholder: 'XX-XXX-XXXX' },
    { code: 'EG', name: 'Egypt', dial_code: '+20', flag: '🇪🇬', placeholder: 'XX XXXX XXXX' },
    { code: 'NZ', name: 'New Zealand', dial_code: '+64', flag: '🇳🇿', placeholder: 'XX XXX XXXX' },
    { code: 'IE', name: 'Ireland', dial_code: '+353', flag: '🇮🇪', placeholder: 'XX XXX XXXX' },
    { code: 'PL', name: 'Poland', dial_code: '+48', flag: '🇵🇱', placeholder: 'XXX XXX XXX' },
    { code: 'PT', name: 'Portugal', dial_code: '+351', flag: '🇵🇹', placeholder: 'XXX XXX XXX' }
];

export const US_STATES = [
    'Wyoming', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
    'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
    'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin'
];

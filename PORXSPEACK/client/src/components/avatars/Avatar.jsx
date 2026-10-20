import React from 'react';

// Predefined Cartoon Avatar characters with crisp, standalone SVG definitions
export const AVATAR_PRESETS = [
  {
    id: 'alex-dev',
    name: 'Alex Rivera',
    title: 'Senior Developer',
    role: 'Engineering',
    color: '#6366F1',
    description: 'Tech lead with hoodie and glasses',
  },
  {
    id: 'sarah-design',
    name: 'Sarah Chen',
    title: 'Lead Product Designer',
    role: 'Design',
    color: '#EC4899',
    description: 'Designer with top bun & creative style',
  },
  {
    id: 'marcus-lead',
    name: 'Marcus Vance',
    title: 'Product Manager',
    role: 'Management',
    color: '#10B981',
    description: 'Product manager with crisp collar & neat hair',
  },
  {
    id: 'elena-analyst',
    name: 'Elena Rostova',
    title: 'Data Scientist',
    role: 'Analytics',
    color: '#F59E0B',
    description: 'Data wizard with golden spectacles & blazer',
  },
  {
    id: 'kai-creative',
    name: 'Kai Tanaka',
    title: 'Frontend Architect',
    role: 'Engineering',
    color: '#EAB308',
    description: 'Creative coder with yellow beanie & headphones',
  },
  {
    id: 'maya-engineer',
    name: 'Maya Patel',
    title: 'Cloud DevOps',
    role: 'Infrastructure',
    color: '#06B6D4',
    description: 'Cloud architect with cyan jacket & headset',
  },
  {
    id: 'sam-marketing',
    name: 'Sam Wilson',
    title: 'Growth Specialist',
    role: 'Marketing',
    color: '#8B5CF6',
    description: 'Marketer with royal blue collar & confident smile',
  },
  {
    id: 'chloe-support',
    name: 'Chloe Dubois',
    title: 'Customer Experience',
    role: 'Operations',
    color: '#14B8A6',
    description: 'Client lead with warm presence & headphones',
  },
];

// Helper to get preset by ID
export const getAvatarPreset = (id) => {
  return AVATAR_PRESETS.find((p) => p.id === id) || AVATAR_PRESETS[0];
};

/**
 * Avatar SVG graphic render based on avatar ID
 */
export const AvatarGraphic = ({ avatarId = 'alex-dev', size = 48, className = '' }) => {
  const s = size;
  
  switch (avatarId) {
    case 'sarah-design':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="48" fill="#FCE7F3" stroke="#F472B6" strokeWidth="3" />
          {/* Bun */}
          <circle cx="50" cy="22" r="14" fill="#3B1C10" />
          {/* Hair base */}
          <path d="M26 48 C26 28, 74 28, 74 48 C74 54, 70 58, 70 58 C70 58, 64 36, 50 36 C36 36, 30 58, 30 58 C30 58, 26 54, 26 48 Z" fill="#3B1C10" />
          {/* Face */}
          <ellipse cx="50" cy="54" rx="20" ry="22" fill="#FBD6B7" />
          {/* Eyes */}
          <circle cx="43" cy="52" r="3" fill="#1F2937" />
          <circle cx="57" cy="52" r="3" fill="#1F2937" />
          {/* Smile */}
          <path d="M44 63 Q50 68 56 63" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          {/* Earrings */}
          <circle cx="28" cy="56" r="3.5" fill="#F59E0B" />
          <circle cx="72" cy="56" r="3.5" fill="#F59E0B" />
          {/* Clothes */}
          <path d="M24 95 C24 76, 36 74, 50 74 C64 74, 76 76, 76 95 Z" fill="#DB2777" />
          <path d="M42 74 C42 80, 58 80, 58 74 Z" fill="#FBD6B7" />
        </svg>
      );

    case 'marcus-lead':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="48" fill="#D1FAE5" stroke="#34D399" strokeWidth="3" />
          {/* Neck */}
          <rect x="44" y="66" width="12" height="14" fill="#E0AC84" />
          {/* Face */}
          <rect x="32" y="32" width="36" height="38" rx="14" fill="#E0AC84" />
          {/* Hair */}
          <path d="M30 36 C30 22, 48 18, 70 24 C72 32, 68 34, 68 34 L32 34 Z" fill="#1E293B" />
          {/* Eyes & brows */}
          <rect x="38" y="44" width="8" height="2" fill="#0F172A" />
          <rect x="54" y="44" width="8" height="2" fill="#0F172A" />
          <circle cx="42" cy="49" r="2.8" fill="#0F172A" />
          <circle cx="58" cy="49" r="2.8" fill="#0F172A" />
          {/* Smile */}
          <path d="M44 58 Q50 63 56 58" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" />
          {/* Suit/Shirt */}
          <path d="M22 95 C22 76, 34 74, 50 74 C66 74, 78 76, 78 95 Z" fill="#065F46" />
          <polygon points="50,74 44,92 56,92" fill="#FFFFFF" />
          <polygon points="48,78 52,78 51,90 49,90" fill="#059669" />
        </svg>
      );

    case 'elena-analyst':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="48" fill="#FEF3C7" stroke="#FBBF24" strokeWidth="3" />
          {/* Curly hair back */}
          <circle cx="32" cy="45" r="16" fill="#78350F" />
          <circle cx="68" cy="45" r="16" fill="#78350F" />
          <circle cx="50" cy="30" r="18" fill="#78350F" />
          {/* Face */}
          <circle cx="50" cy="54" r="20" fill="#FCD34D" />
          {/* Glasses */}
          <circle cx="42" cy="50" r="7" stroke="#92400E" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" />
          <circle cx="58" cy="50" r="7" stroke="#92400E" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" />
          <line x1="49" y1="50" x2="51" y2="50" stroke="#92400E" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="42" cy="50" r="2.5" fill="#451A03" />
          <circle cx="58" cy="50" r="2.5" fill="#451A03" />
          {/* Smile */}
          <path d="M45 62 Q50 66 55 62" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
          {/* Clothes */}
          <path d="M22 96 C22 78, 35 75, 50 75 C65 75, 78 78, 78 96 Z" fill="#D97706" />
        </svg>
      );

    case 'kai-creative':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="48" fill="#FEF9C3" stroke="#FACC15" strokeWidth="3" />
          {/* Beanie Hat */}
          <path d="M28 40 C28 20, 72 20, 72 40 Z" fill="#CA8A04" />
          <rect x="25" y="36" width="50" height="9" rx="4" fill="#EAB308" />
          {/* Face */}
          <ellipse cx="50" cy="55" rx="19" ry="20" fill="#FED7AA" />
          {/* Eyes */}
          <circle cx="43" cy="52" r="3" fill="#1E293B" />
          <circle cx="57" cy="52" r="3" fill="#1E293B" />
          {/* Smirk */}
          <path d="M45 63 Q52 66 57 61" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
          {/* Headphones around neck */}
          <path d="M30 68 C30 80, 70 80, 70 68" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
          <rect x="26" y="62" width="8" height="12" rx="4" fill="#475569" />
          <rect x="66" y="62" width="8" height="12" rx="4" fill="#475569" />
          {/* Clothes */}
          <path d="M24 95 C24 78, 35 76, 50 76 C65 76, 76 78, 76 95 Z" fill="#475569" />
        </svg>
      );

    case 'maya-engineer':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="48" fill="#CFFAFE" stroke="#22D3EE" strokeWidth="3" />
          {/* Hair Bob */}
          <path d="M24 50 C24 24, 76 24, 76 50 C76 68, 70 70, 70 70 L30 70 C30 70, 24 68, 24 50 Z" fill="#4C1D95" />
          {/* Face */}
          <circle cx="50" cy="52" r="19" fill="#FBCFE8" />
          {/* Hair bangs */}
          <path d="M31 42 C40 48, 60 48, 69 42 C69 34, 31 34, 31 42 Z" fill="#4C1D95" />
          {/* Eyes */}
          <circle cx="43" cy="50" r="3" fill="#1E1B4B" />
          <circle cx="57" cy="50" r="3" fill="#1E1B4B" />
          {/* Smile */}
          <path d="M44 61 Q50 65 56 61" stroke="#BE185D" strokeWidth="2.2" strokeLinecap="round" />
          {/* Tech Headset microphone */}
          <path d="M68 50 C68 64, 58 68, 52 68" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="51" cy="68" r="3.5" fill="#0EA5E9" />
          {/* Clothes */}
          <path d="M22 96 C22 77, 34 74, 50 74 C66 74, 78 77, 78 96 Z" fill="#0891B2" />
        </svg>
      );

    case 'sam-marketing':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="48" fill="#EDE9FE" stroke="#A78BFA" strokeWidth="3" />
          {/* Face */}
          <rect x="33" y="34" width="34" height="36" rx="14" fill="#FBBF24" />
          {/* Hair pompadour */}
          <path d="M28 32 C30 16, 68 14, 72 30 C72 34, 30 36, 28 32 Z" fill="#581C87" />
          {/* Eyes */}
          <circle cx="42" cy="48" r="2.8" fill="#1E1B4B" />
          <circle cx="58" cy="48" r="2.8" fill="#1E1B4B" />
          {/* Big smile */}
          <path d="M43 59 Q50 66 57 59" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
          {/* Clothes */}
          <path d="M22 96 C22 76, 35 73, 50 73 C65 73, 78 76, 78 96 Z" fill="#6D28D9" />
          <circle cx="64" cy="85" r="3" fill="#FACC15" />
        </svg>
      );

    case 'chloe-support':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="48" fill="#CCFBF1" stroke="#2DD4BF" strokeWidth="3" />
          {/* Long Hair */}
          <path d="M24 45 C24 22, 76 22, 76 45 C76 75, 72 80, 72 80 C72 80, 68 40, 50 40 C32 40, 28 80, 28 80 C28 80, 24 75, 24 45 Z" fill="#7C2D12" />
          {/* Face */}
          <ellipse cx="50" cy="53" rx="19" ry="21" fill="#FFEDD5" />
          {/* Eyes */}
          <circle cx="43" cy="50" r="3" fill="#1C1917" />
          <circle cx="57" cy="50" r="3" fill="#1C1917" />
          {/* Cheeks */}
          <circle cx="37" cy="57" r="3.5" fill="rgba(244, 63, 94, 0.3)" />
          <circle cx="63" cy="57" r="3.5" fill="rgba(244, 63, 94, 0.3)" />
          {/* Smile */}
          <path d="M44 62 Q50 67 56 62" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
          {/* Clothes */}
          <path d="M22 96 C22 78, 35 75, 50 75 C65 75, 78 78, 78 96 Z" fill="#0D9488" />
        </svg>
      );

    case 'alex-dev':
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="48" fill="#E0E7FF" stroke="#818CF8" strokeWidth="3" />
          {/* Face */}
          <ellipse cx="50" cy="52" rx="20" ry="21" fill="#FCD34D" />
          {/* Hair */}
          <path d="M28 42 C28 22, 72 22, 72 42 C72 36, 68 28, 50 28 C32 28, 28 36, 28 42 Z" fill="#312E81" />
          {/* Glasses */}
          <rect x="34" y="44" width="13" height="11" rx="3" stroke="#1E1B4B" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" />
          <rect x="53" y="44" width="13" height="11" rx="3" stroke="#1E1B4B" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" />
          <line x1="47" y1="49" x2="53" y2="49" stroke="#1E1B4B" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="40" cy="49" r="2.5" fill="#1E1B4B" />
          <circle cx="59" cy="49" r="2.5" fill="#1E1B4B" />
          {/* Smile */}
          <path d="M44 62 Q50 67 56 62" stroke="#92400E" strokeWidth="2.2" strokeLinecap="round" />
          {/* Hoodie */}
          <path d="M22 96 C22 76, 35 73, 50 73 C65 73, 78 76, 78 96 Z" fill="#4338CA" />
          <polygon points="50,73 45,86 55,86" fill="#FCD34D" />
        </svg>
      );
  }
};

/**
 * Avatar component with size variants, availability badge, and active highlights
 */
export const Avatar = ({
  avatarId = 'alex-dev',
  size = 48,
  availability = null,
  showStatus = true,
  isSelected = false,
  className = '',
  onClick = null,
}) => {
  const statusColors = {
    Available: '#10B981',
    Busy: '#EF4444',
    Away: '#F59E0B',
    Offline: '#6B7280',
  };

  const statusColor = availability ? statusColors[availability] || '#6B7280' : null;

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: '50%',
        boxShadow: isSelected ? '0 0 0 3px var(--accent-primary), 0 0 12px var(--accent-glow)' : 'none',
        transition: 'all 0.2s ease',
      }}
      className={`proxi-avatar ${isSelected ? 'avatar-selected' : ''} ${className}`}
      title={availability ? `Status: ${availability}` : ''}
    >
      <AvatarGraphic avatarId={avatarId} size={size} />

      {/* Availability indicator dot */}
      {showStatus && statusColor && (
        <span
          style={{
            position: 'absolute',
            bottom: size > 40 ? 2 : 0,
            right: size > 40 ? 2 : 0,
            width: Math.max(8, Math.round(size * 0.22)),
            height: Math.max(8, Math.round(size * 0.22)),
            borderRadius: '50%',
            backgroundColor: statusColor,
            border: '2px solid var(--bg-card, #1E293B)',
            boxShadow: `0 0 5px ${statusColor}`,
          }}
        />
      )}
    </div>
  );
};

export default Avatar;

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = '', size = 24 }) => {
  // Map icon names to Lucide components
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    // Fallback if icon name not found
    return <LucideIcons.HelpCircle className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
};

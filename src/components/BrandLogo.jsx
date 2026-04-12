import React, { useState } from 'react';
import Icon from './AppIcon';

const BrandLogo = ({
  size = 'md',
  showTagline = false,
  className = '',
  textClassName = '',
  imageClassName = ''
}) => {
  const [hasImageError, setHasImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-11 h-11',
    lg: 'w-12 h-12'
  };

  const resolvedSize = sizeClasses?.[size] || sizeClasses.md;

  return (
    <div className={`flex items-center space-x-3 ${className}`.trim()}>
      <div className={`${resolvedSize} flex items-center justify-center`.trim()}>
        {hasImageError ? (
          <div className="w-full h-full bg-primary rounded-xl flex items-center justify-center shadow-soft">
            <Icon name="Shield" size={24} color="white" strokeWidth={2.5} />
          </div>
        ) : (
          <img
            src="/assets/images/logo.png"
            alt="Disaster Preparedness Education System Logo"
            className={`w-full h-full object-contain ${imageClassName}`.trim()}
            onError={() => setHasImageError(true)}
          />
        )}
      </div>

      <div className={`flex flex-col ${textClassName}`.trim()}>
        <span className="text-lg font-semibold text-foreground leading-tight line-clamp-1">
          DisasterEd
        </span>
        {showTagline ? (
          <span className="text-sm text-muted-foreground leading-tight">
            Disaster Preparedness and Response Education System
          </span>
        ) : (
          <span className="text-xs font-medium text-primary leading-tight">
            India
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;

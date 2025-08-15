import React from 'react';
import Button from './Button';


const ContextualActionBar = ({ 
  actions = [], 
  position = 'sticky',
  className = '',
  isLoading = false 
}) => {
  const positionClasses = {
    sticky: 'sticky bottom-0',
    fixed: 'fixed bottom-0 left-0 right-0',
    floating: 'fixed bottom-6 right-6'
  };

  if (!actions?.length) return null;

  return (
    <div 
      className={`
        ${positionClasses?.[position]} 
        bg-card border-t border-border shadow-modal z-1000
        ${position === 'floating' ? 'rounded-lg border' : ''}
        ${className}
      `}
    >
      <div className={`
        ${position === 'floating' ? 'p-4' : 'p-6'}
        ${position !== 'floating' ? 'max-w-7xl mx-auto' : ''}
      `}>
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between space-x-4">
          {/* Primary Actions */}
          <div className="flex items-center space-x-3">
            {actions?.filter(action => action?.variant === 'primary' || !action?.variant)?.map((action, index) => (
                <Button
                  key={index}
                  variant={action?.variant || 'default'}
                  size={action?.size || 'default'}
                  onClick={action?.onClick}
                  disabled={action?.disabled || isLoading}
                  loading={action?.loading || (isLoading && action?.primary)}
                  iconName={action?.icon}
                  iconPosition={action?.iconPosition || 'left'}
                  className={action?.className}
                >
                  {action?.label}
                </Button>
              ))}
          </div>
          
          {/* Secondary Actions */}
          <div className="flex items-center space-x-2">
            {actions?.filter(action => action?.variant === 'secondary' || action?.variant === 'outline' || action?.variant === 'ghost')?.map((action, index) => (
                <Button
                  key={index}
                  variant={action?.variant}
                  size={action?.size || 'default'}
                  onClick={action?.onClick}
                  disabled={action?.disabled || isLoading}
                  loading={action?.loading}
                  iconName={action?.icon}
                  iconPosition={action?.iconPosition || 'left'}
                  className={action?.className}
                >
                  {action?.label}
                </Button>
              ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          {/* Primary Actions - Full Width */}
          {actions?.filter(action => action?.variant === 'primary' || !action?.variant)?.map((action, index) => (
              <Button
                key={index}
                variant={action?.variant || 'default'}
                size="lg"
                fullWidth
                onClick={action?.onClick}
                disabled={action?.disabled || isLoading}
                loading={action?.loading || (isLoading && action?.primary)}
                iconName={action?.icon}
                iconPosition={action?.iconPosition || 'left'}
                className={action?.className}
              >
                {action?.label}
              </Button>
            ))}
          
          {/* Secondary Actions - Grid Layout */}
          {actions?.filter(action => 
            action?.variant === 'secondary' || 
            action?.variant === 'outline' || 
            action?.variant === 'ghost'
          )?.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {actions?.filter(action => 
                  action?.variant === 'secondary' || 
                  action?.variant === 'outline' || 
                  action?.variant === 'ghost'
                )?.map((action, index) => (
                  <Button
                    key={index}
                    variant={action?.variant}
                    size="default"
                    onClick={action?.onClick}
                    disabled={action?.disabled || isLoading}
                    loading={action?.loading}
                    iconName={action?.icon}
                    iconPosition={action?.iconPosition || 'left'}
                    className={action?.className}
                  >
                    {action?.label}
                  </Button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextualActionBar;
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ userRole = 'student', alertCount = 0, onMenuToggle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasActiveAlerts, setHasActiveAlerts] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  const effectiveRole = user?.role || userRole;

  useEffect(() => {
    setHasActiveAlerts(alertCount > 0);
  }, [alertCount]);

  const navigationItems = [
    {
      label: 'Learn',
      path: '/disaster-learning-modules',
      icon: 'BookOpen',
      description: 'Access learning modules and assessments',
      subItems: [
        { label: 'Learning Modules', path: '/disaster-learning-modules' },
        { label: 'Virtual Drills', path: '/virtual-emergency-drills' },
        { label: 'Assessment', path: '/preparedness-assessment' }
      ]
    },
    {
      label: 'Dashboard',
      path: '/admin-dashboard',
      icon: 'LayoutDashboard',
      description: 'View your personalized dashboard'
    },
    {
      label: 'Alerts',
      path: '/real-time-alerts',
      icon: 'AlertTriangle',
      description: 'Real-time emergency alerts',
      isEmergency: true,
      badge: alertCount
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onMenuToggle) {
      onMenuToggle(!isMobileMenuOpen);
    }
  };

  const isActivePath = (path, subItems = []) => {
    if (location?.pathname === path) return true;
    return subItems?.some((item) => location?.pathname === item?.path);
  };

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Shield" size={24} color="white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-foreground leading-tight">
          DisasterEd
        </span>
        <span className="text-xs font-medium text-primary leading-tight">
          India
        </span>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-100 bg-surface border-b border-border shadow-soft">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex-shrink-0 cursor-pointer transition-quick hover:opacity-80"
            onClick={() => handleNavigation('/disaster-learning-modules')}
          >
            <Logo />
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => {
              const isActive = isActivePath(item?.path, item?.subItems);

              return (
                <div key={item?.path} className="relative group">
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`
                      relative px-4 py-2 text-sm font-medium transition-quick
                      ${item?.isEmergency ? 'hover:bg-error/10' : ''}
                      ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:text-primary'}
                    `}
                    onClick={() => handleNavigation(item?.path)}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon
                        name={item?.icon}
                        size={18}
                        color={item?.isEmergency && hasActiveAlerts ? 'var(--color-error)' : 'currentColor'}
                        className={hasActiveAlerts && item?.isEmergency ? 'animate-alert-pulse' : ''}
                      />
                      <span>{item?.label}</span>
                      {item?.badge > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-error rounded-full animate-alert-pulse">
                          {item?.badge > 99 ? '99+' : item?.badge}
                        </span>
                      )}
                    </div>
                  </Button>

                  {item?.subItems && (
                    <div className="absolute left-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-elevated opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-quick z-110">
                      <div className="py-2">
                        {item?.subItems?.map((subItem) => (
                          <button
                            key={subItem?.path}
                            onClick={() => handleNavigation(subItem?.path)}
                            className={`
                              w-full text-left px-4 py-2 text-sm transition-quick
                              ${location?.pathname === subItem?.path ? 'bg-primary/10 text-primary font-medium' : 'text-popover-foreground hover:bg-muted'}
                            `}
                          >
                            {subItem?.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-gray-900 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-quick pointer-events-none whitespace-nowrap">
                    {item?.description}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {user && (
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{user?.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{effectiveRole}</div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              iconName="LogOut"
              iconPosition="left"
            >
              Sign Out
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="relative"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
              {hasActiveAlerts && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-alert-pulse" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <div className="py-4 space-y-2">
              {user && (
                <div className="px-4 pb-2">
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <div className="font-medium text-foreground">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                    <div className="text-xs text-muted-foreground capitalize mt-1">{effectiveRole}</div>
                  </div>
                </div>
              )}

              {navigationItems?.map((item) => {
                const isActive = isActivePath(item?.path, item?.subItems);

                return (
                  <div key={item?.path}>
                    <button
                      onClick={() => handleNavigation(item?.path)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 text-left transition-quick rounded-lg mx-2
                        ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}
                        ${item?.isEmergency && hasActiveAlerts ? 'border-l-4 border-error' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          name={item?.icon}
                          size={20}
                          color={item?.isEmergency && hasActiveAlerts ? 'var(--color-error)' : 'currentColor'}
                          className={hasActiveAlerts && item?.isEmergency ? 'animate-alert-pulse' : ''}
                        />
                        <div>
                          <div className="font-medium">{item?.label}</div>
                          <div className="text-xs text-muted-foreground">{item?.description}</div>
                        </div>
                      </div>
                      {item?.badge > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-error rounded-full animate-alert-pulse">
                          {item?.badge > 99 ? '99+' : item?.badge}
                        </span>
                      )}
                    </button>

                    {item?.subItems && isActive && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item?.subItems?.map((subItem) => (
                          <button
                            key={subItem?.path}
                            onClick={() => handleNavigation(subItem?.path)}
                            className={`
                              w-full text-left px-4 py-2 text-sm rounded-lg transition-quick
                              ${location?.pathname === subItem?.path ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                            `}
                          >
                            {subItem?.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="px-2 pt-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleSignOut}
                  iconName="LogOut"
                  iconPosition="left"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {hasActiveAlerts && (
        <div className="bg-error text-error-foreground px-4 py-2 text-center text-sm font-medium animate-alert-pulse">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="AlertTriangle" size={16} />
            <span>
              {alertCount} active emergency alert{alertCount !== 1 ? 's' : ''} -
              <button
                onClick={() => handleNavigation('/real-time-alerts')}
                className="ml-1 underline hover:no-underline font-semibold"
              >
                View Details
              </button>
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

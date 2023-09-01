import { memo, useContext, MouseEventHandler } from 'react';
import { ArrowDownCircle, Gift, Grid, Settings } from 'react-feather';
import { NavLink } from 'react-router-dom';
import { PWAInstall } from '../../context/PWAInstall';
import './index.scss';

interface AppLandingProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const Navigation = memo(function Navigation() {
  return (
    <>
      <NavLink to="/app/" className="nav-item">
        <Grid />
        <span className="label">Rooms</span>
      </NavLink>
      <NavLink to="/app/settings" className="nav-item">
        <Settings />
        <span className="label">Settings</span>
      </NavLink>
      <NavLink to="/app/support" className="nav-item">
        <Gift />
        <span className="label">Support</span>
      </NavLink>
    </>
  );
});

function AppLanding({
  children,
  title,
  subtitle,
}: AppLandingProps): React.ReactNode {
  const { installable, deferredPrompt, setInstallable } =
    useContext(PWAInstall);

  const handleInstall: MouseEventHandler = async () => {
    if (
      typeof window === 'undefined' ||
      !installable ||
      deferredPrompt === null
    )
      return;

    setInstallable(false);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    window.gtag('event', 'pwa-install-prompt', {
      outcome,
    });
  };

  return (
    <div className="app-container app-landing-container">
      <header className="app-header">
        <div className="title-nav-wrapper">
          <h1 className="title">{title}</h1>
          <div className="nav">
            {installable && (
              <button
                className="nav-item install"
                title="Install OFS"
                onClick={handleInstall}
              >
                <ArrowDownCircle />
                <span className="label">Install</span>
              </button>
            )}
            <Navigation />
          </div>
        </div>
        <p className="subtitle">{subtitle}</p>
      </header>
      {children}

      <div className="tab-links">
        <Navigation />
      </div>
    </div>
  );
}

export default AppLanding;

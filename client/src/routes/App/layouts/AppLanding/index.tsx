import { memo, useContext, MouseEventHandler } from 'react';
import { ArrowDownCircle, Gift, Grid, Settings } from 'react-feather';
import { Link } from 'react-router-dom';
import { PWAInstall } from '../../context/PWAInstall';

interface AppLandingProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const Navigation = memo(function Navigation() {
  return (
    <>
      <Link to="/app/">
        <Grid />
        <span>Rooms</span>
      </Link>
      <Link to="/app/settings">
        <Settings />
        <span>Settings</span>
      </Link>
      <Link to="/app/support">
        <Gift />
        <span>Support</span>
      </Link>
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
    <div>
      <header>
        <div>
          <h1>{title}</h1>
          <div>
            {installable && (
              <button onClick={handleInstall}>
                <ArrowDownCircle />
                <span>Install</span>
              </button>
            )}
            <Navigation />
          </div>
        </div>
        <p>{subtitle}</p>
      </header>
      {children}

      <div>
        <Navigation />
      </div>
    </div>
  );
}

export default AppLanding;

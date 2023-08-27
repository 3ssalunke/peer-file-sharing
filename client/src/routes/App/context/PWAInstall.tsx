import { createContext, useEffect, useRef, useState } from 'react';

type pwaInstall = {
  installable: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  setInstallable: React.Dispatch<React.SetStateAction<boolean>>;
};

const PWAInstall = createContext<pwaInstall>({
  installable: false,
  deferredPrompt: null,
  setInstallable: () => {},
});

function PWAInstallProvider({ children }: { children: React.ReactNode }) {
  const [installable, setInstallable] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      deferredPrompt.current = e;
      setInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    return () =>
      window.removeEventListener(
        'beforeinstallprompt',
        handler as EventListener
      );
  }, []);

  return (
    <PWAInstall.Provider
      value={{
        installable,
        deferredPrompt: deferredPrompt.current,
        setInstallable,
      }}
    >
      {children}
    </PWAInstall.Provider>
  );
}

export { PWAInstall, PWAInstallProvider };

import { useEffect, useState } from 'react';
import { Routes, useLocation, Location } from 'react-router-dom';
import { SwitchTransition } from 'react-transition-group';

function TransitionRoutes({ children }: { children: React.ReactElement }) {
  const location = useLocation();
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [animType, setAnimType] = useState('enter');

  useEffect(() => {
    const nextDepth = location.pathname.split('/').length;
    const prevDepth = locations?.length
      ? locations[locations.length - 1].pathname.split('/').length
      : -Infinity;

    if (nextDepth > prevDepth) {
      setAnimType('enter');
    } else if (nextDepth < prevDepth) {
      setAnimType('exit');
    }

    if (locations[locations.length - 1] !== location) {
      setLocations([...locations, location]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className={`h-full page-${animType}`}>
      <SwitchTransition>
        {(() => (
          <Routes>{children}</Routes>
        ))()}
      </SwitchTransition>
    </div>
  );
}

export default TransitionRoutes;

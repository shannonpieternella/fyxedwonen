import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { subscriptionApi } from '../../services/api';

const RequireSubscription: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [active, setActive] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await subscriptionApi.status();
        if (mounted) setActive(res?.subscription?.status === 'active');
      } catch (_) {
        if (mounted) setActive(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return null;
  if (!active) return <Navigate to="/subscription" state={{ from: location }} replace />;
  return children;
};

export default RequireSubscription;


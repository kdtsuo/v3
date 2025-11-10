import { useEffect } from 'react';
import { useMeta } from '@/contexts';
import { Home } from '@/pages';

export default function Root() {
  const { setMeta } = useMeta();

  useEffect(() => {
    setMeta({
      title: 'kdt ♥ kpop dance team',
      description: 'discover our performances, join us, and connect!',
    });
  }, [setMeta]);

  return <Home />;
}

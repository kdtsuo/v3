import { useEffect } from 'react';
import { useMeta } from '@/contexts';
import { Home } from '@/pages';

export default function Root() {
  const { setMeta } = useMeta();

  useEffect(() => {
    setMeta({
      title: 'kdt ♥ kpop dance team',
      description: 'kdt at ubco. discover our performances, join us, and connect!',
      ogTitle: 'kdt ♥ kpop dance team',
      ogDescription: 'kdt at ubco. discover our performances, join us, and connect!',
    });
  }, [setMeta]);

  return <Home />;
}

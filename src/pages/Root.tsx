import { Helmet } from 'react-helmet';
import { Home } from '@/pages';

export default function Root() {
  return (
    <>
      <Helmet>
        <title>kdt ♥ kpop dance team</title>
        <meta
          name='description'
          content='kdt at ubco. discover our performances, join us, and connect!'
        />
        <meta property='og:title' content='kdt ♥ kpop dance team' />
        <meta
          property='og:description'
          content='kdt at ubco. discover our performances, join us, and connect!'
        />
      </Helmet>
      <Home />
    </>
  );
}

import { Discover, Footer, QuickLinks } from '@/components';
import { useTheme } from '@/hooks';
import { Helmet } from 'react-helmet';

export default function Home() {
  const { theme } = useTheme();
  return (
    <>
      <Helmet>
        <title>home ♥ kdt</title>
        <meta
          name='description'
          content='All things KPop at UBCO! Dance classes, events, performances, and meetups for all KPop fans.'
        />
        <meta property='og:title' content='KDT Home' />
        <meta
          property='og:description'
          content='All things KPop at UBCO! Dance classes, events, performances, and meetups for all KPop fans.'
        />
      </Helmet>
      <div
        id='top'
        className='animate-fade-in overflow-x-none mx-auto h-auto pt-34 pb-10 md:pt-46'
        style={{
          background: `var(--bg-dotted-${theme === 'dark' ? 'dark' : 'light'})`,
        }}
      >
        <div className='text-center text-xl md:text-4xl'>
          <h1>all things kpop at ubco!</h1>
          <h1>dance classes, events, performances</h1>
          <h1>and meetups for all kpop fans ♥</h1>
        </div>
        <div className='flex w-full justify-center'>
          <QuickLinks />
        </div>
        <Discover />
      </div>

      <Footer />
    </>
  );
}

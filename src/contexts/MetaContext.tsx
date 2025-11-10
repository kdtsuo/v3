import { createContext, useContext, useState, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

export type MetaInfo = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  ogType?: string;
  twitterCard?: string;
};

const defaultMeta: MetaInfo = {
  title: 'kdt ♥ kpop dance team',
  description: 'discover our performances, join us, and connect!',
  url: 'https://kdtsuo.vercel.app/',
  image: 'https://metatags.io/images/meta-tags.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

const MetaContext = createContext<{
  meta: MetaInfo;
  setMeta: (meta: MetaInfo) => void;
}>({
  meta: defaultMeta,
  setMeta: () => {},
});

export const MetaProvider = ({ children }: { children: ReactNode }) => {
  const [meta, setMeta] = useState<MetaInfo>(defaultMeta);

  return (
    <MetaContext.Provider value={{ meta, setMeta }}>
      <Helmet>
        {/* Primary Meta Tags */}
        {meta.title && <title>{meta.title}</title>}
        {meta.title && <meta name='title' content={meta.title} />}
        {meta.description && <meta name='description' content={meta.description} />}

        {/* Open Graph / Facebook */}
        {meta.ogType && <meta property='og:type' content={meta.ogType} />}
        {meta.url && <meta property='og:url' content={meta.url} />}
        {meta.title && <meta property='og:title' content={meta.title} />}
        {meta.description && (
          <meta property='og:description' content={meta.description} />
        )}
        {meta.image && <meta property='og:image' content={meta.image} />}

        {/* X (Twitter) */}
        {meta.twitterCard && <meta property='twitter:card' content={meta.twitterCard} />}
        {meta.url && <meta property='twitter:url' content={meta.url} />}
        {meta.title && <meta property='twitter:title' content={meta.title} />}
        {meta.description && (
          <meta property='twitter:description' content={meta.description} />
        )}
        {meta.image && <meta property='twitter:image' content={meta.image} />}
      </Helmet>
      {children}
    </MetaContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMeta = () => {
  const { meta, setMeta } = useContext(MetaContext);
  return { meta, setMeta };
};

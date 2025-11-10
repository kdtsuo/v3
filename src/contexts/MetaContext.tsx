import { createContext, useContext, useState, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

export type MetaInfo = {
  title?: string;
  description?: string;
  url?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
};

const defaultMeta: MetaInfo = {
  title: 'kdt ♥ kpop dance team',
  description: 'discover our performances, join us, and connect!',
  url: 'https://kdtsuo.vercel.app/',
  ogType: 'website',
  ogTitle: 'kdt ♥ kpop dance team',
  ogDescription: 'discover our performances, join us, and connect!',
  ogImage: '',
  twitterCard: 'summary_large_image',
  twitterUrl: 'https://kdtsuo.vercel.app/',
  twitterTitle: 'kdt ♥ kpop dance team',
  twitterDescription: 'discover our performances, join us, and connect!',
  twitterImage: '',
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
        {meta.ogTitle && <meta property='og:title' content={meta.ogTitle} />}
        {meta.ogDescription && (
          <meta property='og:description' content={meta.ogDescription} />
        )}
        {meta.ogImage && <meta property='og:image' content={meta.ogImage} />}

        {/* X (Twitter) */}
        {meta.twitterCard && <meta property='twitter:card' content={meta.twitterCard} />}
        {meta.twitterUrl && <meta property='twitter:url' content={meta.twitterUrl} />}
        {meta.twitterTitle && (
          <meta property='twitter:title' content={meta.twitterTitle} />
        )}
        {meta.twitterDescription && (
          <meta property='twitter:description' content={meta.twitterDescription} />
        )}
        {meta.twitterImage && (
          <meta property='twitter:image' content={meta.twitterImage} />
        )}
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

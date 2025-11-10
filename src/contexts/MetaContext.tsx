import { createContext, useContext, useState, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

export type MetaInfo = {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterImage?: string;
};

const defaultMeta: MetaInfo = {
  title: 'kdt ♥ kpop dance team',
  description: 'kdt at ubco. discover our performances, join us, and connect!',
  ogTitle: 'kdt ♥ kpop dance team',
  ogDescription: 'kdt at ubco. discover our performances, join us, and connect!',
  ogImage: '',
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
        {meta.title && <title>{meta.title}</title>}
        {meta.description && <meta name='description' content={meta.description} />}
        {meta.ogTitle && <meta property='og:title' content={meta.ogTitle} />}
        {meta.ogDescription && (
          <meta property='og:description' content={meta.ogDescription} />
        )}
        {meta.ogImage && <meta property='og:image' content={meta.ogImage} />}
        {meta.twitterImage && <meta name='twitter:image' content={meta.twitterImage} />}
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

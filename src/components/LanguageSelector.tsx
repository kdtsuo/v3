import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { Languages } from 'lucide-react';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          config: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          },
          elementId: string,
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export default function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const script = document.createElement('script');
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ko,zh-CN,ja',
            layout: 0,
            autoDisplay: false,
          },
          'google_translate_element',
        );
        setIsInitialized(true);
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isInitialized]);

  const changeLanguage = (langCode: string) => {
    const selected = languages.find((lang) => lang.code === langCode);
    if (selected) {
      setCurrentLanguage(selected);
    }

    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;

    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id='google_translate_element' style={{ display: 'none' }}></div>

      {/* Custom Language Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            role='button'
            className='hover:bg-accent flex cursor-pointer items-center gap-2 rounded-xl
              p-2 outline transition-colors'
          >
            <Languages className='h-[1.2rem] w-[1.2rem]' />
            <span className='hidden text-sm font-medium sm:inline'>
              {currentLanguage.flag}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className='cursor-pointer'
            >
              <span className='mr-2'>{lang.flag}</span>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

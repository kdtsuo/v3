// @ts-expect-error static import
import rmlogo from '@/assets/img/rmlogo.png';
import { useTheme } from '@/hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { getDelayClass } from '@/utils';
import type { SocialLink } from '@/types';
import { socialLinks as SocialFallback } from '@/lib/FallbackData/SocialFallback';

export default function Footer() {
  const getYear = () => {
    const date = new Date();
    return date.getFullYear();
  };
  const { theme } = useTheme();
  const socialLinks: SocialLink[] = SocialFallback;
  return (
    <Card
      className='bg-primary-foreground rounded-none border-none py-10 text-center'
      style={{
        background: `var(--bg-xless-dotted-${theme === 'dark' ? 'dark' : 'light'})`,
      }}
    >
      <CardHeader>
        <CardTitle>&copy; {getYear()} KDT ("KPop Dance Team")</CardTitle>
        <CardDescription className='text-lg'></CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-center space-x-2 text-sm mb-4'>
          <p>Made with ❤️ by</p>
          <span>
            <a href='https://rinmeng.github.io' target='_blank' rel='noreferrer'>
              <img src={rmlogo} alt='rmlogo' className='mx-1 h-auto w-16' />
            </a>
          </span>
        </div>
        <p className='mb-6'>
          All photos are provided by{' '}
          <a className='underline' href='https://www.tsengphoto.ca/' target='_blank'>
            Tseng Photography
          </a>
          .
        </p>

        {/* Social Links Section - Horizontal Layout */}
        <div className='flex w-full flex-wrap items-center justify-center gap-4 pb-2'>
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className={`fade-in-from-bottom ${getDelayClass(index)} w-full max-w-xs
              sm:w-1/2 md:w-1/3 lg:w-1/5`}
            >
              <Card
                className='bg-secondary-foreground transition-all duration-200
                  hover:-translate-y-1 hover:shadow-lg h-full'
              >
                <CardHeader
                  className='flex flex-row items-center justify-between space-x-4'
                >
                  <img
                    src={link.icon}
                    alt={link.title}
                    className='h-7 w-7 not-dark:invert-0 dark:invert-100'
                  />
                  <CardTitle
                    className='text-primary-foreground text-base font-extralight
                      whitespace-nowrap'
                  >
                    {link.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

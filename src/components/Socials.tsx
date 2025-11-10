import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui';
import { getDelayClass } from '@/utils';
import type { SocialLink } from '@/types';

interface SocialsProps {
  socialLinks: SocialLink[];
}

export function Socials({ socialLinks }: SocialsProps) {
  return (
    <div className='flex h-auto w-full items-center justify-center'>
      <Card className='fade-in-from-bottom m-5 w-full max-w-6xl overflow-hidden'>
        <CardHeader>
          <CardTitle className='fade-in-from-bottom text-4xl'>Connect With Us</CardTitle>
          <CardDescription className='fade-in-from-bottom'>
            Let's get connected, we'd love to hear from you!
          </CardDescription>
        </CardHeader>
        <CardContent className='relative flex flex-col p-0 lg:flex-row'>
          {/* Social Media Cards Section */}
          <div className='mx-auto flex w-full flex-col sm:w-1/2'>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`fade-in-from-bottom lg:last:col-span-2
                  ${getDelayClass(index)}`}
                >
                  <Card
                    className='bg-secondary-foreground transition-all duration-200
                      hover:-translate-y-1 hover:shadow-lg'
                  >
                    <CardHeader
                      className='flex flex-row items-center justify-between space-x-4'
                    >
                      <img
                        src={link.icon}
                        alt={link.title}
                        className='h-12 w-12 not-dark:invert-0 dark:invert-100'
                      />
                      <CardTitle
                        className='text-primary-foreground text-xl font-extralight'
                      >
                        {link.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

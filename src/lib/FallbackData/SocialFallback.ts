// @ts-expect-error static import
import discordlogo from '@/assets/img/icons/discordlogo.png';
// @ts-expect-error static import
import facebooklogo from '@/assets/img/icons/facebooklogo.png';
// @ts-expect-error static import
import githublogo from '@/assets/img/icons/githublogo.png';
// @ts-expect-error static import
import instagramlogo from '@/assets/img/icons/instagramlogo.png';
// @ts-expect-error static import
import maillogo from '@/assets/img/icons/maillogo.png';
import type { SocialLink } from '@/types';

export const socialLinks: SocialLink[] = [
  {
    icon: discordlogo,
    href: 'https://discord.com/invite/tbKkvjV2W8',
    title: 'Discord',
  },
  {
    icon: instagramlogo,
    href: 'https://www.instagram.com/kdt.suo/?theme=dark',
    title: 'Instagram',
  },
  {
    icon: maillogo,
    href: 'mailto:kpopdanceteam.suo@gmail.com',
    title: 'Email',
  },
  {
    icon: githublogo,
    href: 'https://github.com/kdtsuo/v3',
    title: 'GitHub',
  },
  {
    icon: facebooklogo,
    href: 'https://www.facebook.com/profile.php?id=61577850668849',
    title: 'Facebook',
  },
];

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

export default function Footer() {
  const getYear = () => {
    const date = new Date();
    return date.getFullYear();
  };
  const { theme } = useTheme();
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
        <div className='flex items-center justify-center space-x-2 text-sm'>
          <p>Made with ❤️ by</p>
          <span>
            <a href='https://rinmeng.github.io' target='_blank' rel='noreferrer'>
              <img src={rmlogo} alt='rmlogo' className='mx-1 h-auto w-16' />
            </a>
          </span>
        </div>
        <p>
          All photos are provided by{' '}
          <a className='underline' href='https://www.tsengphoto.ca/' target='_blank'>
            Tseng Photography
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}

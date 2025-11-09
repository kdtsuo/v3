import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useTheme } from '@/hooks';
import dancepractice from '../assets/img/stock/dancepractice.png';
import events from '../assets/img/stock/events.jpeg';
import events2 from '../assets/img/stock/events2.jpeg';
import events3 from '../assets/img/stock/events3.jpeg';
import showcase from '../assets/img/stock/showcase.jpeg';
import { Activity } from './subcomponents';

interface ActivityProps {
  images: string[];
  title: string;
  text: string;
  reverse: boolean;
}

export default function Activities() {
  const { theme } = useTheme();
  const activities: ActivityProps[] = [
    {
      images: [dancepractice],
      title: 'Dance Workshops',
      text: 'We provide drop-in dance classes for the general public and extra dance practices for performance groups! Learn from experienced instructors in a fun, supportive environment.',
      reverse: false,
    },
    {
      images: [events, events2, events3],
      title: 'K-Pop Events',
      text: 'We host K-pop related events including random dance challenges, watch parties, karaokes, and other activities that promote K-pop and Korean culture!',
      reverse: true,
    },
    {
      images: [showcase],
      title: 'K-Fest Showcase',
      text: 'Annually, we host K-pop dance concerts to showcase our dance skills and creativity! Join us for an unforgettable experience celebrating K-pop performance.',
      reverse: false,
    },
  ];

  return (
    <Card
      className='m-5 mt-10'
      style={{
        background: `var(--bg-less-dotted-${theme === 'dark' ? 'dark' : 'light'})`,
      }}
    >
      <CardHeader>
        <CardTitle className='text-center text-6xl'>Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {activities.map((activity, index) => (
            <Activity
              key={index}
              images={activity.images}
              title={activity.title}
              text={activity.text}
              reverse={activity.reverse}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

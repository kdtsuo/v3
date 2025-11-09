import { Activities, Footer } from '@/components';
// @ts-expect-error static import
import teamphoto from '../assets/img/stock/teamphoto.jpeg?quality=20';

export default function About() {
  return (
    <div id='top' className='animate-fade-in h-auto overflow-x-hidden'>
      <div className='relative h-screen w-screen'>
        <img
          className='absolute inset-0 h-full w-full object-cover brightness-[0.40]'
          src={teamphoto}
          alt='team'
          loading='eager'
        />

        <div
          className='relative flex h-full flex-col items-center justify-center p-4
            text-white'
        >
          <div>
            <h1
              className='text-lightblue-100 my-5 text-center text-3xl font-bold
                lg:text-4xl fade-in-from-bottom delay-75'
            >
              What is KDT?
            </h1>
            <p className='lg:paragraph max-w-screen-sm text-center text-xl fade-in-from-bottom delay-150'>
              The KPop Dance Team (KDT), is a team consisting of diverse, unique
              individuals that have common interests in dancing, choreographing, and
              performing to promote korean pop-culture, and have fun!
            </p>
          </div>
        </div>
      </div>
      <Activities />
      <Footer />
    </div>
  );
}

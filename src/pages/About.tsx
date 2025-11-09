import { Activities, Footer } from '@/components';
import teamphoto from '../assets/img/stock/teamphoto.jpeg';

export default function About() {
  return (
    <div id='top' className='animate-fade-in h-auto overflow-x-hidden'>
      <div className='relative h-screen w-screen'>
        <img
          className='absolute inset-0 h-full w-full object-cover brightness-[0.40]'
          src={teamphoto}
          alt='team'
        />

        <div
          className='relative flex h-full flex-col items-center justify-center p-4
            text-white'
        >
          <div>
            <h1
              className='text-lightblue-100 my-5 text-center text-3xl font-bold
                lg:text-4xl'
            >
              What is KDT?
            </h1>
            <p className='lg:paragraph max-w-screen-sm text-center text-xl'>
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

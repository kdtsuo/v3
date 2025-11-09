import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Separator,
} from '@/components/ui';

interface ActivityProps {
  images: string[];
  title: string;
  text: string;
  reverse: boolean;
  isLast?: boolean;
}

export default function Activity({ images, title, text, reverse, isLast = false }: ActivityProps) {
  return (
    <div className='flex w-full flex-col items-center'>
      <div
        className={`flex flex-col ${
          reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } w-full items-center justify-center overflow-hidden md:space-x-4`}
      >
        <div className='flex w-full justify-center px-10 py-6 lg:w-1/2'>
          <Carousel className='w-11/12 rounded-xl border lg:w-5/6'>
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <img
                    className='h-full w-full rounded-xl object-cover shadow-lg'
                    src={img}
                    alt={`${title} image`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <Card className='t200e w-full max-w-lg shadow-lg hover:-translate-y-3 lg:w-1/2'>
          <CardHeader>
            <CardTitle className='text-2xl capitalize lg:text-3xl'>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className='text-lg leading-relaxed'>{text}</CardDescription>
          </CardContent>
        </Card>
      </div>

      {isLast && <Separator className='my-10 w-1/2 rounded-full' />}
    </div>
  );
}

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
} from "@/components/ui";

interface ActivityProps {
  images: string[];
  title: string;
  text: string;
  reverse: boolean;
  isLast?: boolean;
}

export default function Activity({
  images,
  title,
  text,
  reverse,
  isLast = false,
}: ActivityProps) {
  return (
    <div className='w-full flex flex-col items-center'>
      <div
        className={`flex flex-col ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        } 
        w-full justify-center items-center md:space-x-4 overflow-hidden`}
      >
        <div className='w-full lg:w-1/2 flex justify-center py-6 px-10'>
          <Carousel className='w-11/12 lg:w-5/6 border rounded-xl'>
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <img
                    className='w-full h-full rounded-xl shadow-lg object-cover'
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

        <Card
          className='w-full lg:w-1/2 max-w-lg shadow-lg
          t200e hover:-translate-y-3'
        >
          <CardHeader>
            <CardTitle className='text-2xl lg:text-3xl capitalize'>
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className='text-lg leading-relaxed'>
              {text}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {isLast && <Separator className='w-1/2 rounded-full my-10' />}
    </div>
  );
}

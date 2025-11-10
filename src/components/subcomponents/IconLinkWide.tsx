import { cn } from '@/lib';
import type { IconLinkWideProps } from '@/types';
import { iconMap } from '@/utils';
import { ChevronRight } from 'lucide-react';
import { Badge, Button } from '@/components/ui';

export default function IconLinkWide({
  iconType,
  label,
  link,
  className,
  date,
  price,
  style,
}: IconLinkWideProps) {
  const isNew = date
    ? new Date(date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false;

  const iconDetails = iconType ? iconMap[iconType] : undefined;
  const Icon = iconDetails?.iconComponent;
  const imagePath = iconDetails?.imagePath;

  const LinkContent = () => (
    <>
      <div className='flex w-full items-center'>
        <div className='mr-4 flex-shrink-0'>
          <div>{Icon && <Icon className='[&_svg]:size-8' />}</div>
          {imagePath && <img src={imagePath} alt={label} className='h-auto w-8' />}
        </div>
        <h1 className='flex-grow truncate text-center text-base md:text-xl'>{label}</h1>
        <div className='flex-shrink-0'>
          <ChevronRight
            className='t200e -translate-x-full opacity-0 group-hover:translate-x-0
              group-hover:opacity-100'
          />
        </div>
      </div>

      <div className='absolute top-0 right-0 m-1 mt-2 mr-2 flex gap-1'>
        {isNew && (
          <Badge variant={'default'} className='rounded-md text-xs'>
            <h1>NEW</h1>
          </Badge>
        )}
        {typeof price === 'number' && !isNaN(price) && (
          <Badge variant={price === 0 ? 'green' : 'gold'} className='rounded-md text-xs'>
            <h1>{price === 0 ? 'FREE' : `$${price.toFixed(2)}`}</h1>
          </Badge>
        )}
      </div>
    </>
  );

  return (
    <div className='relative flex items-center justify-center' style={style}>
      {' '}
      {/* <-- Add style here */}
      <Button
        asChild
        variant='ghost'
        className={cn(
          `t200e group relative flex h-20 w-full items-center rounded-xl px-4 py-3 text-lg
          font-medium`,
          className
        )}
        onClick={() => {
          window.open(link, '_blank');
        }}
      >
        <div className='flex w-full'>
          <LinkContent />
        </div>
      </Button>
    </div>
  );
}

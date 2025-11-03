import { ChevronRight } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { iconMap } from "@/utils";
import { cn } from "@/lib";
import type { IconLinkWideProps } from "@/types";

export default function IconLinkWide({
  iconType,
  label,
  link,
  className,
  date,
  price,
}: IconLinkWideProps) {
  const isNew = date
    ? new Date(date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false;

  const iconDetails = iconType ? iconMap[iconType] : undefined;
  const Icon = iconDetails?.iconComponent;
  const imagePath = iconDetails?.imagePath;

  const LinkContent = () => (
    <>
      <div className='flex items-center w-full'>
        <div className='flex-shrink-0 mr-4'>
          <div>{Icon && <Icon className='[&_svg]:size-8' />}</div>
          {imagePath && (
            <img src={imagePath} alt={label} className='w-8 h-auto' />
          )}
        </div>
        <h1 className='flex-grow text-center text-base md:text-xl'>{label}</h1>
        <div className='flex-shrink-0'>
          <ChevronRight className='t200e opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-0' />
        </div>
      </div>

      <div className='absolute flex gap-1 top-0 right-0 m-1 mr-2 mt-2'>
        {isNew && (
          <Badge variant={"default"} className='text-xs rounded-md'>
            <h1>NEW</h1>
          </Badge>
        )}
        {typeof price === "number" && !isNaN(price) && (
          <Badge variant={"green"} className='text-xs rounded-md'>
            <h1>{price === 0 ? "FREE" : `$${price.toFixed(2)}`}</h1>
          </Badge>
        )}
      </div>
    </>
  );

  return (
    <div className='flex items-center justify-center relative'>
      <Button
        asChild
        variant='ghost'
        className={cn(
          "h-20 t200e relative flex w-full items-center px-4 py-3 rounded-xl text-lg font-medium group",
          className
        )}
        onClick={() => {
          window.open(link, "_blank");
        }}
      >
        <div className='flex w-full'>
          <LinkContent />
        </div>
      </Button>
    </div>
  );
}

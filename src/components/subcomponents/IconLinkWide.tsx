import { ChevronRight, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import iconMap from "@/utils/iconMap";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import type { IconLinkWideProps } from "@/types/type";

export default function IconLinkWide({
  iconType,
  label,
  link,
  className,
  onDelete,
  deleteMode,
  date,
  price,
}: IconLinkWideProps) {
  const { user } = useAuth();
  const isNew = date
    ? new Date(date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false;

  const deleteLink = () => {
    if (onDelete) {
      onDelete();
    } else {
      toast.success(`Deleted link: ${label}`);
    }
  };

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
      {user && deleteMode && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size='icon'
              variant='destructive'
              className='absolute -top-2 -left-2 size-8 rounded-full p-0 z-10'
            >
              <X size={14} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='sm:max-w-md'>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Link</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the "{label}" link? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='flex-row gap-2 flex justify-center'>
              <AlertDialogCancel className='cursor-pointer'>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteLink}
                className='bg-destructive hover:bg-destructive/90 cursor-pointer'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

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

      <Toaster />
    </div>
  );
}

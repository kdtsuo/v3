import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks';
import { supabase } from '@/lib';
import type { SponsorData } from '@/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  image: z.string().url('Please enter a valid image URL'),
  location: z.string().min(1, 'Location is required'),
  maplink: z.string().url('Please enter a valid map link URL'),
  text: z.string().min(1, 'Discount text is required'),
  websitelink: z.string().url('Please enter a valid website URL'),
});

interface EditSponsorDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sponsor: SponsorData;
  onSponsorUpdated: () => void;
}

export function EditSponsorDialog({
  open,
  setOpen,
  sponsor,
  onSponsorUpdated,
}: EditSponsorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: sponsor.title || '',
      image: sponsor.image || '',
      location: sponsor.location || '',
      maplink: sponsor.maplink || '',
      text: sponsor.text || '',
      websitelink: sponsor.websitelink || '',
    },
  });

  useEffect(() => {
    form.reset({
      title: sponsor.title || '',
      image: sponsor.image || '',
      location: sponsor.location || '',
      maplink: sponsor.maplink || '',
      text: sponsor.text || '',
      websitelink: sponsor.websitelink || '',
    });
  }, [sponsor, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          title: values.title,
          image: values.image,
          location: values.location,
          maplink: values.maplink,
          text: values.text,
          websitelink: values.websitelink,
        })
        .eq('id', sponsor.id);

      if (error) throw error;

      toast.success('Sponsor updated successfully!');
      setOpen(false);
      onSponsorUpdated();
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error('Failed to update sponsor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Edit Sponsor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            <div className='grid gap-4 py-2'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Sponsor name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://example.com/image.png' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder='123 Main St' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='maplink'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map Link</FormLabel>
                    <FormControl>
                      <Input placeholder='https://maps.google.com/...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='text'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Text</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. 10% off for KDT members!' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='websitelink'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsor's Website Link</FormLabel>
                    <FormControl>
                      <Input placeholder='https://example.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex justify-end'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  'Update Sponsor'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

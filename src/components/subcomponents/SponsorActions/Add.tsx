import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui';
import { Loader2, ListPlus } from 'lucide-react';
import { useToast } from '@/hooks';
import { supabase } from '@/lib';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  image: z.string().url('Please enter a valid image URL'),
  location: z.string().min(1, 'Location is required'),
  maplink: z.string().url('Please enter a valid map link URL'),
  text: z.string().min(1, 'Discount text is required'),
  websitelink: z.string().url('Please enter a valid website URL'),
});

export function AddSponsorDialog({ onSponsorAdded }: { onSponsorAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      image: '',
      location: '',
      maplink: '',
      text: '',
      websitelink: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No authenticated user found');
      }

      const { error } = await supabase.from('sponsors').insert([
        {
          title: values.title,
          image: values.image,
          location: values.location,
          maplink: values.maplink,
          text: values.text,
          websitelink: values.websitelink,
          user_id: user.id,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success('Sponsor added successfully!');
      form.reset();
      setIsOpen(false);
      onSponsorAdded();
    } catch (error) {
      console.error('Error adding sponsor:', error);
      toast.error('Failed to add sponsor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='flex cursor-pointer items-center gap-2' variant='default'>
          <ListPlus size={20} /> Add Sponsor
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Add New Sponsor</DialogTitle>
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
                    <FormDescription>Enter a URL for the sponsor's logo image</FormDescription>
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
                    Adding...
                  </>
                ) : (
                  'Add Sponsor'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

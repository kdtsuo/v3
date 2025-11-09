import { useState, useEffect, useCallback } from 'react';
import joinourteam from '@/assets/img/stock/joinourteam.jpeg';
import { Footer } from '@/components';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
  Input,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Clipboard, Edit, Loader2, X, Plus, Trash } from 'lucide-react';
import { useToast, useAuth } from '@/hooks';
import { supabase } from '@/lib';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Position, ActionType } from '@/types';

const fallbackPositions: Position[] = [
  {
    label: 'Senior Executive Team',
    form_url: 'https://forms.gle/ufezb8Gut92E7pMeA',
    is_accepting_responses: true,
  },
  {
    label: 'Junior Executive Team',
    form_url: 'https://forms.gle/ufezb8Gut92E7pMeA',
    is_accepting_responses: true,
  },
  {
    label: 'Dance Instructor',
    form_url: 'https://forms.gle/eciAuTKB63WLQzGg7',
    is_accepting_responses: true,
  },
  {
    label: 'Performance Group',
    form_url: 'https://forms.gle/4CFzbsd3Xn1Lstns8',
    is_accepting_responses: true,
  },
  {
    label: 'Cameraman',
    form_url: 'https://forms.gle/LpXTwzCNKjVZN3De9',
    is_accepting_responses: true,
  },
];

const positionSchema = z.object({
  label: z.string().min(1, 'Position name is required'),
  form_url: z.string().url('Must be a valid URL'),
  is_accepting_responses: z.boolean().default(true),
});

export default function Positions() {
  const [value, setValue] = useState<string>('');
  const [formClosed, setFormClosed] = useState<boolean>(false);
  const [positionsData, setPositionsData] = useState<Position[]>(fallbackPositions);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Admin dialog states
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [selectedAdminPosition, setSelectedAdminPosition] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Position form using react-hook-form with zod validation
  const form = useForm<z.infer<typeof positionSchema>>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      label: '',
      form_url: '',
      is_accepting_responses: true,
    },
  });

  const fetchPositionFromDatabase = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Fetch error details:', error);
        throw error;
      }

      const positions = data && data.length > 0 ? data : fallbackPositions;
      setPositionsData(positions);
    } catch (error) {
      console.error('Error fetching positions from database:', error);
      // Use fallback positions if database fetch fails
      setPositionsData(fallbackPositions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle form submission based on action type
  const handleSubmit = async (data: z.infer<typeof positionSchema>) => {
    setIsSubmitting(true);
    try {
      if (selectedAction === 'add') {
        // Add position to database
        const { error } = await supabase.from('positions').insert([
          {
            ...data,
            user_id: user?.id,
          },
        ]);

        if (error) throw error;
        toast.success('Position added successfully!');
      } else if (selectedAction === 'update') {
        // Update position in database
        const position = positionsData.find(
          (p) => p.label.toLowerCase().replace(/\s+/g, '') === selectedAdminPosition,
        );

        if (!position) throw new Error('Position not found');

        const { error } = await supabase.from('positions').update(data).eq('label', position.label);

        if (error) throw error;
        toast.success('Position updated successfully!');
      }

      // Refresh positions data
      await fetchPositionFromDatabase();

      // Reset states
      setSelectedAction(null);
      setSelectedAdminPosition('');
    } catch (error) {
      console.error('Error managing position:', error);
      toast.error('Failed to manage position');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle position deletion
  const handleDeletePosition = async () => {
    setIsSubmitting(true);
    try {
      const position = positionsData.find(
        (p) => p.label.toLowerCase().replace(/\s+/g, '') === selectedAdminPosition,
      );

      if (!position) throw new Error('Position not found');

      const { error } = await supabase.from('positions').delete().eq('label', position.label);

      if (error) throw error;

      toast.success('Position deleted successfully!');
      await fetchPositionFromDatabase();

      // Reset states
      setSelectedAction(null);
      setSelectedAdminPosition('');
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error('Failed to delete position');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check all form status when component mounts
  useEffect(() => {
    fetchPositionFromDatabase();
  }, [fetchPositionFromDatabase]);

  // Update formClosed status when value changes
  useEffect(() => {
    if (value) {
      const selectedPosition = positionsData.find(
        (p) => p.label.toLowerCase().replace(/\s+/g, '') === value,
      );
      setFormClosed(selectedPosition ? !selectedPosition.is_accepting_responses : false);
    } else {
      setFormClosed(false);
    }
  }, [value, positionsData]);

  useEffect(() => {
    if (value) {
      const selectedPosition = positionsData.find(
        (p) => p.label.toLowerCase().replace(/\s+/g, '') === value,
      );
      setFormClosed(selectedPosition ? !selectedPosition.is_accepting_responses : false);
    } else {
      setFormClosed(false);
    }
  }, [value, positionsData]);

  // Set form values when editing a position
  useEffect(() => {
    if (selectedAction === 'update' && selectedAdminPosition) {
      const position = positionsData.find(
        (p) => p.label.toLowerCase().replace(/\s+/g, '') === selectedAdminPosition,
      );
      if (position) {
        form.reset({
          label: position.label,
          form_url: position.form_url,
          is_accepting_responses: position.is_accepting_responses,
        });
      }
    } else if (selectedAction === 'add') {
      // Reset form when adding a new position
      form.reset({
        label: '',
        form_url: '',
        is_accepting_responses: true,
      });
    }
  }, [selectedAction, selectedAdminPosition, positionsData, form]);

  return (
    <div className='animate-fade-in overflow-x-hidden'>
      <div className='relative h-screen w-screen'>
        <img
          className='absolute inset-0 h-full w-full object-cover brightness-[0.25]'
          src={joinourteam}
          alt='team'
        />

        <div className='relative flex h-full flex-col items-center justify-center space-y-4 p-4 text-white'>
          <div>
            <h1 className='text-lightblue-100 my-5 text-center text-3xl font-bold lg:text-4xl'>
              Find out what position fits you!
            </h1>
            <p className='lg:paragraph max-w-screen-sm text-center text-xl'>
              We have a variety of positions available for you to join! Whether you're interested in
              dancing, videography, or graphic design, we have a spot for you.
            </p>
          </div>
          <div className='flex justify-center gap-4'>
            {/* Manage Positions Section */}
            {user && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className='cursor-pointer' variant='secondary'>
                    <Edit />
                    Manage Positions
                  </Button>
                </DialogTrigger>
                <DialogContent className='w-[350px] lg:w-[500px]'>
                  <DialogHeader>
                    <DialogTitle>Manage Positions</DialogTitle>
                    <DialogDescription>
                      Add, update or delete position information
                    </DialogDescription>
                  </DialogHeader>

                  {/* Action Type Selection */}
                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-col space-y-2'>
                      <Label>Select Action</Label>
                      <Select
                        value={selectedAction || ''}
                        onValueChange={(value) => {
                          setSelectedAction(value as ActionType);
                          if (value === 'add') {
                            setSelectedAdminPosition('');
                          }
                        }}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select action...' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value='add'>
                              <div className='flex items-center'>
                                <Plus className='mr-2 h-4 w-4' /> Add Position
                              </div>
                            </SelectItem>
                            <SelectItem value='update'>
                              <div className='flex items-center'>
                                <Edit className='mr-2 h-4 w-4' /> Update Position
                              </div>
                            </SelectItem>
                            <SelectItem value='delete'>
                              <div className='flex items-center'>
                                <Trash className='mr-2 h-4 w-4' /> Delete Position
                              </div>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Position Selection (only for update and delete) */}
                    {(selectedAction === 'update' || selectedAction === 'delete') && (
                      <div className='flex flex-col space-y-2'>
                        <Label>Select Position:</Label>
                        <Select
                          value={selectedAdminPosition}
                          onValueChange={(value) => {
                            setSelectedAdminPosition(value);
                          }}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select position...' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {positionsData.map((position) => {
                                const positionValue = position.label
                                  .toLowerCase()
                                  .replace(/\s+/g, '');

                                return (
                                  <SelectItem key={positionValue} value={positionValue}>
                                    <div className='flex w-full items-center justify-between'>
                                      {position.label.length > 38
                                        ? position.label.substring(0, 35) + '...'
                                        : position.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Form for Add or Update */}
                    {(selectedAction === 'add' ||
                      (selectedAction === 'update' && selectedAdminPosition)) && (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
                          <FormField
                            control={form.control}
                            name='label'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position Name</FormLabel>
                                <FormControl>
                                  <Input placeholder='Enter position name' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='form_url'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Form URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='https://docs.google.com/forms/d/e/...'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='is_accepting_responses'
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                                <div className='space-y-0.5'>
                                  <FormLabel>Accepting Responses</FormLabel>
                                  <FormDescription>
                                    Toggle if this position is currently accepting applications
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <div className='flex justify-end gap-2'>
                            <DialogClose asChild>
                              <Button type='button' variant='outline'>
                                Close
                              </Button>
                            </DialogClose>
                            <Button type='submit' variant='default' disabled={isSubmitting}>
                              {isSubmitting && <Loader2 className='h-4 w-4 animate-spin' />}
                              {selectedAction === 'add'
                                ? 'Add Position'
                                : isSubmitting
                                  ? 'Updating...'
                                  : 'Update Position'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}
                  </div>
                  <DialogFooter>
                    {/* Delete Confirmation */}
                    {selectedAction === 'delete' && selectedAdminPosition && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='destructive'>Delete Position</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Permanently delete the position "
                              {(() => {
                                const label =
                                  positionsData.find(
                                    (p) =>
                                      p.label.toLowerCase().replace(/\s+/g, '') ===
                                      selectedAdminPosition,
                                  )?.label || '';

                                return label.length > 38 ? label.substring(0, 35) + '...' : label;
                              })()}
                              " from the database? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeletePosition}
                              disabled={isSubmitting}
                              className='bg-destructive dark:text-destructive-foreground not-dark:text-background'
                            >
                              {isSubmitting && <Loader2 className='animate-spin' />}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Check Positions Section */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    fetchPositionFromDatabase();
                  }}
                  className='cursor-pointer'
                  variant='secondary'
                >
                  Check Positions
                </Button>
              </DialogTrigger>
              <DialogContent className='w-[350px] lg:w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Positions</DialogTitle>
                </DialogHeader>
                <DialogDescription>Select a position that you're interested in.</DialogDescription>
                <div className='flex items-center justify-center'>
                  <Select
                    value={value}
                    onValueChange={(newValue) => {
                      setValue(newValue);
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select position...' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {positionsData.map((position) => {
                          const positionValue = position.label.toLowerCase().replace(/\s+/g, '');

                          return (
                            <SelectItem
                              key={positionValue}
                              value={positionValue}
                              disabled={!position.is_accepting_responses}
                              className={
                                !position.is_accepting_responses ? 'text-red-500 opacity-75' : ''
                              }
                            >
                              <div className='flex w-full items-center justify-between'>
                                {position.label}
                                {!position.is_accepting_responses && (
                                  <X className='ml-2 h-4 w-4 text-red-500' />
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {/* Show message when selected form is closed */}
                {value && formClosed && (
                  <div className='flex items-center text-red-500'>
                    <span className='text-xs'>
                      We are not accepting applications for this position currently
                    </span>
                  </div>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    {value && (
                      <Button
                        variant='secondary'
                        className='cursor-pointer border'
                        onClick={() => {
                          navigator.clipboard.writeText(
                            positionsData.find(
                              (p) => p.label.toLowerCase().replace(/\s+/g, '') === value,
                            )?.form_url || '',
                          );
                          toast.success('Copied link to clipboard!');
                        }}
                      >
                        Copy Link <Clipboard />
                      </Button>
                    )}
                  </DialogClose>
                  <DialogClose asChild>
                    {value && (
                      <Button
                        variant='default'
                        className='cursor-pointer'
                        disabled={!value}
                        onClick={() => {
                          const selectedPosition = positionsData.find(
                            (p) => p.label.toLowerCase().replace(/\s+/g, '') === value,
                          );
                          window.open(selectedPosition?.form_url, '_blank');
                        }}
                      >
                        Goto Form
                      </Button>
                    )}
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

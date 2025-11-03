import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Badge,
} from "@/components/ui";
import { Edit } from "lucide-react";
import { useAuth, useToast, useTheme } from "@/hooks";
import { supabase } from "@/lib";

// Import sponsor images
import bubblewaffle from "@/assets/sponsors/bubblewaffle.png";
import formosa from "@/assets/sponsors/formosa.png";
import tossingpizzeria from "@/assets/sponsors/tossingpizzeria.jpeg";
import macaoimperialtea from "@/assets/sponsors/macaoimperialtea.png";
import seoulful from "@/assets/sponsors/seoulful.png";
import {
  Loader2,
  ListPlus,
  SquareArrowOutUpRight,
  ImageIcon,
  X,
  MapPin,
} from "lucide-react";
import { Footer } from "@/components";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SponsorData, SponsorProps } from "@/types";

// Define the schema for our sponsor form
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string().url("Please enter a valid image URL"),
  location: z.string().min(1, "Location is required"),
  maplink: z.string().url("Please enter a valid map link URL"),
  text: z.string().min(1, "Discount text is required"),
  websitelink: z.string().url("Please enter a valid website URL"),
});

const Sponsor: React.FC<SponsorProps & { onSponsorUpdated?: () => void }> = ({
  id,
  image,
  title,
  location,
  maplink,
  text,
  websitelink,
  isAdmin = false,
  onSponsorDeleted = () => {},
  onSponsorUpdated = () => {},
}) => {
  const [imageError, setImageError] = useState(false);
  const { theme } = useTheme();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card className='group relative overflow-hidden gap-0 rounded-xl t200e animate-fade-in w-full max-w-md mx-auto p-0 '>
      {/* Admin buttons */}
      {isAdmin && id && (
        <div className='absolute top-1 right-1 z-20 flex gap-2'>
          <Button
            className='h-8 w-8 p-0'
            variant='secondary'
            size='sm'
            onClick={(e) => {
              e.stopPropagation();
              setEditOpen(true);
            }}
          >
            <Edit size={16} />
          </Button>
          <DeleteSponsorDialog
            sponsor={{ id, image, title, location, maplink, text, websitelink }}
            onSponsorDeleted={onSponsorDeleted}
          />
        </div>
      )}

      {/* Edit Sponsor Dialog */}
      {isAdmin && id && (
        <EditSponsorDialog
          open={editOpen}
          setOpen={setEditOpen}
          sponsor={{ id, image, title, location, maplink, text, websitelink }}
          onSponsorUpdated={onSponsorUpdated}
        />
      )}

      {/* Sponsor logo area */}
      <div className='relative h-48 overflow-hidden'>
        <div
          className='block w-full h-full'
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className='absolute inset-0 flex items-center justify-center p-6'
            style={{
              background: `var(--bg-xless-dotted-${
                theme === "dark" ? "dark" : "light"
              })`,
            }}
          >
            {imageError ? (
              <div className='flex flex-col items-center justify-center'>
                <ImageIcon size={48} className='text-gray-300 mb-2' />
                <span className='text-gray-500 text-sm'>{title}</span>
              </div>
            ) : (
              <img
                src={image}
                alt={title}
                className='object-contain max-h-32 t200e group-hover:scale-110'
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sponsor content */}
      <CardContent className='p-6 text-center bg-muted/20 space-y-4 flex flex-col justify-center items-center'>
        <CardTitle>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              window.open(websitelink, "_blank");
            }}
          >
            <div className='text-lg md:text-2xl font-medium'>{title}</div>
            <SquareArrowOutUpRight />
          </Button>
        </CardTitle>
        <Button
          variant='secondary'
          onClick={(e) => {
            e.stopPropagation();
            window.open(maplink, "_blank");
          }}
        >
          <MapPin />
          <div className='text-xs md:text-sm font-medium'>{location}</div>
          <SquareArrowOutUpRight size={10} />
        </Button>
        <Badge className='text-sm bg-yellow-500 text-black'>{text}</Badge>
      </CardContent>
    </Card>
  );
};
// EditSponsorDialog component
function EditSponsorDialog({
  open,
  setOpen,
  sponsor,
  onSponsorUpdated,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  sponsor: SponsorData;
  onSponsorUpdated: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: sponsor.title || "",
      image: sponsor.image || "",
      location: sponsor.location || "",
      maplink: sponsor.maplink || "",
      text: sponsor.text || "",
      websitelink: sponsor.websitelink || "",
    },
  });

  useEffect(() => {
    form.reset({
      title: sponsor.title || "",
      image: sponsor.image || "",
      location: sponsor.location || "",
      maplink: sponsor.maplink || "",
      text: sponsor.text || "",
      websitelink: sponsor.websitelink || "",
    });
  }, [sponsor, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("sponsors")
        .update({
          title: values.title,
          image: values.image,
          location: values.location,
          maplink: values.maplink,
          text: values.text,
          websitelink: values.websitelink,
        })
        .eq("id", sponsor.id);

      if (error) throw error;

      toast.success("Sponsor updated successfully!");
      setOpen(false);
      onSponsorUpdated();
    } catch (error) {
      console.error("Error updating sponsor:", error);
      toast.error("Failed to update sponsor. Please try again.");
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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
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
                      <Input
                        placeholder='https://example.com/image.png'
                        {...field}
                      />
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
                      <Input
                        placeholder='https://maps.google.com/...'
                        {...field}
                      />
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
                      <Input
                        placeholder='e.g. 10% off for KDT members!'
                        {...field}
                      />
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
                  "Update Sponsor"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Add Sponsor Dialog Component
function AddSponsorDialog({ onSponsorAdded }: { onSponsorAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      location: "",
      maplink: "",
      text: "",
      websitelink: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { error } = await supabase.from("sponsors").insert([
        {
          title: values.title,
          image: values.image,
          location: values.location,
          maplink: values.maplink,
          text: values.text,
          websitelink: values.websitelink,
          user_id: user.id, // Add this line
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success("Sponsor added successfully!");
      form.reset();
      setIsOpen(false);
      onSponsorAdded();
    } catch (error) {
      console.error("Error adding sponsor:", error);
      toast.error("Failed to add sponsor. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className='flex items-center gap-2 cursor-pointer'
          variant='default'
        >
          <ListPlus size={20} /> Add Sponsor
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Add New Sponsor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
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
                      <Input
                        placeholder='https://example.com/image.png'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a URL for the sponsor's logo image
                    </FormDescription>
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
                      <Input
                        placeholder='https://maps.google.com/...'
                        {...field}
                      />
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
                      <Input
                        placeholder='e.g. 10% off for KDT members!'
                        {...field}
                      />
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
                  "Add Sponsor"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteSponsorDialog({
  sponsor,
  onSponsorDeleted,
}: {
  sponsor: SponsorData;
  onSponsorDeleted: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!sponsor.id) {
      toast.error("Cannot delete sponsor without an ID");
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("sponsors")
        .delete()
        .eq("id", sponsor.id);

      if (error) {
        throw error;
      }

      toast.success("Sponsor deleted successfully!");
      setIsOpen(false);
      onSponsorDeleted();
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      toast.error("Failed to delete sponsor. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className='flex items-center gap-2 z-20 size-8 p-0'
          variant='destructive'
          size='sm'
          onClick={(e) => e.stopPropagation()}
        >
          <X size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Sponsor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{sponsor.title}</strong>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            className='bg-destructive dark:text-primary not-dark:text-white hover:bg-destructive/90'
          >
            {isDeleting ? (
              <>
                <Loader2 className='animate-spin' />
                Deleting...
              </>
            ) : (
              "Delete Sponsor"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Sponsors Page Component
export default function Sponsors() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const { theme } = useTheme();
  const { toast } = useToast();

  // Fetch sponsors from Supabase
  const fetchSponsors = useCallback(async () => {
    setIsLoading(true);
    // Default sponsors to use as fallback
    const defaultSponsors: SponsorData[] = [
      {
        image: seoulful,
        title: "Seoulful Convenience",
        location: "1619 Ellis St",
        maplink:
          "https://www.google.ca/maps/place/Seoulful+Convenience/@49.885116,-119.4959369,17z/data=!3m1!4b1!4m6!3m5!1s0x537df52e4a80e70f:0x77812feb6aba0273!8m2!3d49.8851126!4d-119.493362!16s%2Fg%2F11lnhlpht6?entry=ttu&g_ep=EgoyMDI0MTExMC4wIKXMDSoASAFQAw%3D%3D",
        text: "5% off for KDT members!",
        websitelink: "https://seoulfulconvenience.ca",
      },
      {
        image: macaoimperialtea,
        title: "Macao Imperial Tea",
        location: "590 Hwy 33 W #23",
        maplink:
          "https://www.google.ca/maps/place/Macao+Imperial+Tea/@49.8896423,-119.4000558,17z/data=!3m2!4b1!5s0x537d8d254aed5519:0xcfc309a147be2f5b!4m6!3m5!1s0x537d8de1f6a33909:0x884826c2eda55afd!8m2!3d49.8896389!4d-119.3974809!16s%2Fg%2F11tjx7cm31?entry=ttu&g_ep=EgoyMDI0MTAxNC4wIKXMDSoASAFQAw%3D%3D",
        text: "15% off for KDT members!",
        websitelink: "https://www.macaoimperialteacanada.com/",
      },
      {
        image: tossingpizzeria,
        title: "Tossing Pizzeria",
        location: "975 Academy Way #120",
        maplink:
          "https://www.google.ca/maps/place/Tossing+Pizzeria/@49.9350734,-119.4035122,17z/data=!3m1!4b1!4m6!3m5!1s0x537d8d9a4dffe3cf:0xf3f5a3a909ce0167!8m2!3d49.93507!4d-119.3986413!16s%2Fg%2F11hnt50t51?entry=ttu&g_ep=EgoyMDI0MTAxNC4wIKXMDSoASAFQAw%3D%3D",
        text: "15% off for KDT members!",
        websitelink: "https://www.tossingpizzeria.com/",
      },
      {
        image: bubblewaffle,
        title: "Bubble Waffle Cafe",
        location: "5538 Airport Way #102",
        maplink:
          "https://www.google.ca/maps/place/%E9%B8%A1%E8%9B%8B%E4%BB%94+Bubble+Waffle+Cafe+(Chinese+Restaurant)/@49.9508013,-119.3867347,17z/data=!3m2!4b1!5s0x537ded77da6dd3e9:0x1754ea70f96d416c!4m6!3m5!1s0x537ded5b5af637c7:0x58f6b1e233da392!8m2!3d49.9507979!4d-119.3841598!16s%2Fg%2F11v3yzttsy?entry=ttu&g_ep=EgoyMDI0MTAxNC4wIKXMDSoASAFQAw%3D%3D",
        text: "12% off for KDT members!",
        websitelink: "https://www.bubblewafflecafe.ca/",
      },
      {
        image: formosa,
        title: "Formosa Tea Cafe",
        location: "1970 Kane Rd Unit 210",
        maplink:
          "https://www.google.ca/maps/place/Formosa+Tea+Cafe+-+Glenmore+Location+(Bubble+Tea)/@49.9151098,-119.4450163,17z/data=!3m1!4b1!4m6!3m5!1s0x537df363e212f627:0x6cc37747be5faec5!8m2!3d49.9151064!4d-119.4424414!16s%2Fg%2F11tdbmlwh7?entry=ttu&g_ep=EgoyMDI0MTAxNC4wIKXMDSoASAFQAw%3D%3D",
        text: "10% off for KDT members!",
        websitelink: "https://www.formosateacafe.ca/",
      },
    ];
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .order("title", { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setSponsors(data);
      } else {
        // Use default sponsors if none found in the database
        setSponsors(defaultSponsors);
      }
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      toast.error("Failed to load sponsors. Using default data.");
      setSponsors(defaultSponsors);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch sponsors on component mount
  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  return (
    <div>
      <section
        id='sponsors'
        className='relative overflow-hidden px-10 pt-30 md:pt-46'
        style={{
          background: `var(--bg-dotted-${theme === "dark" ? "dark" : "light"})`,
        }}
      >
        <div className='max-w-6xl mx-auto relative z-10'>
          {/* Admin section for logged in users */}
          {user && (
            <div className='mb-10 pt-10 flex justify-end'>
              <AddSponsorDialog onSponsorAdded={fetchSponsors} />
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className='flex justify-center items-center min-h-[200px]'>
              <Loader2 className='h-10 w-10 animate-spin text-lb-500' />
            </div>
          ) : (
            /* Sponsors grid */
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16'>
              {sponsors.map((sponsor, index) => (
                <Sponsor
                  key={index}
                  id={sponsor.id}
                  image={sponsor.image}
                  title={sponsor.title}
                  location={sponsor.location}
                  maplink={sponsor.maplink}
                  text={sponsor.text}
                  websitelink={sponsor.websitelink}
                  isAdmin={!!user}
                  onSponsorDeleted={fetchSponsors}
                  onSponsorUpdated={fetchSponsors}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

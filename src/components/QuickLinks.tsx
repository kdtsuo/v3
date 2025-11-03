import IconLinkWide from "@/components/subcomponents/IconLinkWide";
import { Check, DollarSign, ListPlus, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import iconMap from "@/utils/iconMap";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Link } from "@/types/type";

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  link: z.string().url("Please enter a valid URL"),
  iconType: z.string().min(1, "Icon type is required"),
  price: z
    .number({ invalid_type_error: "Enter a number or leave blank" })
    .min(0, "Enter a number or leave blank")
    .optional()
    .or(z.literal(undefined)),
});

const fallbackLinks: Link[] = [
  {
    iconType: "rubric",
    label: "Merch",
    link: "https://campus.hellorubric.com/?s=7805",
    date: "2024-10-31",
    price: undefined,
  },
  {
    iconType: "rubric",
    label: "Membership & Ticket Sales",
    link: "https://campus.hellorubric.com/?s=7805",
    date: "2024-10-31",
    price: undefined,
  },
  {
    iconType: "googleForms",
    label: "Google Forms",
    link: "https://forms.gle/yVZcBeKBWPCm235aA",
    date: "2024-10-31",
    price: undefined,
  },

  {
    iconType: "discord",
    label: "Discord Server",
    link: "https://discord.com/invite/tbKkvjV2W8",
    date: "2024-10-31",
    price: undefined,
  },
];

export default function QuickLinks() {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Fetch error details:", error);
        throw error;
      }

      if (data && data.length > 0) {
        setLinks(data);
      } else {
        setLinks(fallbackLinks);
      }
    } catch (error) {
      toast.error("Failed to load links from database");
      console.error("Error loading links: ", error);
      setLinks(fallbackLinks);
    } finally {
      setLoading(false);
    }
  }

  async function deleteLink(id: number, label: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to delete links");
        return;
      }

      const { error } = await supabase.from("links").delete().eq("id", id);

      if (error) {
        throw error;
      }

      const updatedLinks = links.filter((link) => link.id !== id);

      if (updatedLinks.length === 0) {
        setLinks(fallbackLinks);
      } else {
        setLinks(updatedLinks);
      }

      toast.success(`Deleted link: ${label}`);
    } catch (error) {
      toast.error("Failed to delete link");
      console.error("Error deleting link: ", error);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      link: "",
      iconType: "link",
      price: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to add links");
        return;
      }

      const currentDate = new Date().toISOString().split("T")[0];

      const newLink = {
        ...values,
        date: currentDate,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("links")
        .insert([newLink])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setLinks([data[0], ...links]);
        toast.success(`Added new link: ${values.label}`);
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      toast.error("Failed to add link");
      console.error("Error adding link: ", error);
    }
  }

  return (
    <div
      className={`flex flex-col space-y-4 w-full px-4 lg:mx-4 
                  mt-5 md:max-w-1/2 justify-center m-auto md:mt-10`}
    >
      {user && (
        <div className='flex justify-center space-x-2 mb-4'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant='default'>
                <ListPlus />
                Add Links
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>Add New Link</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
                >
                  <FormField
                    control={form.control}
                    name='label'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link Label</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter link title' {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed for the link.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='link'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder='https://example.com' {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the full URL including https://
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='iconType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className='flex flex-row flex-wrap justify-start md:justify-around'
                          >
                            {Object.keys(iconMap).map((iconKey) => {
                              const Icon = iconMap[iconKey].iconComponent;
                              const imagePath = iconMap[iconKey].imagePath;
                              return (
                                <FormItem
                                  key={iconKey}
                                  className='flex flex-col items-center space-y-2'
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={iconKey}
                                      id={iconKey}
                                      className='sr-only'
                                    />
                                  </FormControl>
                                  <label
                                    htmlFor={iconKey}
                                    className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent ${
                                      field.value === iconKey
                                        ? "border-primary bg-accent"
                                        : "border-muted"
                                    }`}
                                  >
                                    {Icon && <Icon strokeWidth={2} size={30} />}
                                    {imagePath && (
                                      <img
                                        src={imagePath}
                                        alt={iconKey}
                                        className='w-8 h-8 object-contain'
                                      />
                                    )}
                                  </label>
                                </FormItem>
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className='flex items-center justify-between'>
                            <DollarSign className='mr-2' size={25} />
                            <Input
                              className='no-spinner'
                              type='number'
                              placeholder='Enter a number or leave blank to hide'
                              {...field}
                              value={
                                field.value === undefined ? "" : field.value
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(
                                  val === "" ? undefined : Number(val)
                                );
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Leave blank to hide price. Enter 0 for Free, or any
                          value greater than 0.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full'>
                    Add Link
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Button
            variant={deleteMode ? "default" : "outline"}
            className='w-fit'
            onClick={() => setDeleteMode(!deleteMode)}
          >
            {deleteMode ? <Check /> : <Trash2 />}
            {deleteMode ? "Done" : "Delete Links"}
          </Button>
        </div>
      )}

      {loading ? (
        <div className='flex justify-center py-8'>
          <Loader2 className='animate-spin rounded-full h-12 w-12 text-gray-700' />
        </div>
      ) : (
        links.map((link) => (
          <IconLinkWide
            key={link.id || link.label}
            iconType={link.iconType}
            label={link.label}
            link={link.link}
            date={link.date}
            price={link.price}
            className='bg-secondary border-2 
            border-ring text-center drop-shadow-box
            hover:bg-muted'
            deleteMode={deleteMode}
            onDelete={
              link.id !== undefined
                ? () => deleteLink(link.id as number, link.label)
                : undefined
            }
          />
        ))
      )}

      <Toaster />
    </div>
  );
}

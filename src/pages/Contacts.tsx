import discordlogo from "@/assets/img/icons/discordlogo.png";
import githublogo from "@/assets/img/icons/githublogo.png";
import instagramlogo from "@/assets/img/icons/instagramlogo.png";
import maillogo from "@/assets/img/icons/maillogo.png";
import facebooklogo from "@/assets/img/icons/facebooklogo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import emailjs from "emailjs-com";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const service: string = "service_qii0r9i";
const template: string = "template_se1ntd8";
const user: string = "xA2mLRICgKakxEiNJ";

// Define interface for social links
interface SocialLink {
  icon: string;
  href: string;
  title: string;
}

export default function Contacts() {
  const [isCurrentlySubmitting, setIsCurrentlySubmitting] = useState(false);
  const { theme } = useTheme();
  const { toast } = useToast();
  // Define form with React Hook Form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsCurrentlySubmitting(true);
    console.log(values);

    interface EmailJSTemplateParams {
      from_name: string;
      from_email: string;
      message: string;
      [key: string]: string; // Allow for additional string properties
    }

    const templateParams: EmailJSTemplateParams = {
      from_name: values.name,
      from_email: values.email,
      message: values.message,
    };

    try {
      const response = await emailjs.send(
        service,
        template,
        templateParams,
        user
      );
      console.log("SUCCESS!", response.status, response.text);
      toast.success("Message sent!", {
        description: "Thank you for your message. We'll get back to you soon.",
      });
      form.reset();
    } catch (err) {
      console.log("FAILED...", err);
      toast.error("Message failed to send!", {
        description:
          "Sorry, we were unable to send your message. Please try again later.",
      });
    } finally {
      setIsCurrentlySubmitting(false);
    }
  };

  const socialLinks: SocialLink[] = [
    {
      icon: discordlogo,
      href: "https://discord.com/invite/tbKkvjV2W8",
      title: "Discord",
    },
    {
      icon: instagramlogo,
      href: "https://www.instagram.com/kdt.suo/?theme=dark",
      title: "Instagram",
    },
    {
      icon: maillogo,
      href: "mailto:kpopdanceteam.suo@gmail.com",
      title: "Email",
    },
    {
      icon: githublogo,
      href: "https://github.com/kdtsuo/v3",
      title: "GitHub",
    },
    {
      icon: facebooklogo,
      href: "https://www.facebook.com/profile.php?id=61577850668849",
      title: "Facebook",
    },
  ];

  return (
    <>
      <div
        className='animate-fade-in'
        style={{
          background: `var(--bg-dotted-${theme === "dark" ? "dark" : "light"})`,
        }}
      >
        <div></div>
        <div
          className='h-auto lg:h-screen w-full flex items-center justify-center pt-36  
        '
        >
          <Card className='m-5 w-full max-w-6xl overflow-hidden'>
            <CardContent className='p-0 flex flex-col lg:flex-row relative'>
              {/* Social Media Cards Section */}
              <div className='w-full lg:w-1/3 flex flex-col justify-center items-center p-12 py-6 lg:py-12'>
                <div className='w-full flex-grow justify-center flex flex-col py-8 space-y-2'>
                  <h2 className='text-3xl font-bold text-center pb-2'>
                    Connect With Us
                  </h2>
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Card className='hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-secondary-foreground'>
                        <CardHeader className='flex flex-row items-center justify-between lg:justify-start space-x-4'>
                          <img
                            src={link.icon}
                            alt={link.title}
                            className='w-12 h-12 dark:invert-100 not-dark:invert-0'
                          />
                          <CardTitle className='text-xl font-extralight text-primary-foreground'>
                            {link.title}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>

              {/* Divider Line */}
              <div className='hidden lg:block absolute left-1/3 top-0 bottom-0 w-0.5 bg-muted my-8'></div>
              <div className='block lg:hidden w-full h-0.5 bg-muted my-4'></div>

              {/* Contact Form Section */}
              <div className='w-full lg:w-2/3 p-12'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                  >
                    <h2 className='text-3xl font-bold text-center mb-6'>
                      Directly Contact Us
                    </h2>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xl'>Name</FormLabel>
                          <FormControl>
                            <Input placeholder='Your name' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xl'>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='your.email@example.com'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='message'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xl'>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Your message...'
                              className='min-h-32 resize-none'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={isCurrentlySubmitting}
                      type='submit'
                      variant='default'
                      className='w-full'
                    >
                      {isCurrentlySubmitting && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      {isCurrentlySubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
}

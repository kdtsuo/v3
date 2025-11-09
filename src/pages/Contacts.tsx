// @ts-expect-error static import
import discordlogo from '@/assets/img/icons/discordlogo.png';
// @ts-expect-error static import
import githublogo from '@/assets/img/icons/githublogo.png';
// @ts-expect-error static import
import instagramlogo from '@/assets/img/icons/instagramlogo.png';
// @ts-expect-error static import
import maillogo from '@/assets/img/icons/maillogo.png';
// @ts-expect-error static import
import facebooklogo from '@/assets/img/icons/facebooklogo.png';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/components/ui';
import { useToast, useTheme } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import emailjs from 'emailjs-com';
import { Footer } from '@/components';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { SocialLink } from '@/types';

// Define schema for form validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

const service: string = 'service_qii0r9i';
const template: string = 'template_se1ntd8';
const user: string = 'xA2mLRICgKakxEiNJ';

export default function Contacts() {
  const [isCurrentlySubmitting, setIsCurrentlySubmitting] = useState(false);
  const { theme } = useTheme();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsCurrentlySubmitting(true);

    interface EmailJSTemplateParams {
      from_name: string;
      from_email: string;
      message: string;
      [key: string]: string;
    }

    const templateParams: EmailJSTemplateParams = {
      from_name: values.name,
      from_email: values.email,
      message: values.message,
    };

    try {
      await emailjs.send(service, template, templateParams, user);
      toast.success('Message sent!', {
        description: "Thank you for your message. We'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      toast.error('Message failed to send!', {
        description:
          'Sorry, we were unable to send your message. Please try again later.' + err,
      });
    } finally {
      setIsCurrentlySubmitting(false);
    }
  };

  const socialLinks: SocialLink[] = [
    {
      icon: discordlogo,
      href: 'https://discord.com/invite/tbKkvjV2W8',
      title: 'Discord',
    },
    {
      icon: instagramlogo,
      href: 'https://www.instagram.com/kdt.suo/?theme=dark',
      title: 'Instagram',
    },
    {
      icon: maillogo,
      href: 'mailto:kpopdanceteam.suo@gmail.com',
      title: 'Email',
    },
    {
      icon: githublogo,
      href: 'https://github.com/kdtsuo/v3',
      title: 'GitHub',
    },
    {
      icon: facebooklogo,
      href: 'https://www.facebook.com/profile.php?id=61577850668849',
      title: 'Facebook',
    },
  ];

  const directContact = false;

  return (
    <>
      <div
        className='animate-fade-in'
        style={{
          background: `var(--bg-dotted-${theme === 'dark' ? 'dark' : 'light'})`,
        }}
      >
        <div></div>
        <div className='flex h-auto w-full items-center justify-center pt-36 lg:h-screen'>
          <Card className='m-5 w-full max-w-6xl overflow-hidden'>
            <CardHeader>
              <CardTitle className='text-4xl'>Connect With Us</CardTitle>
              <CardDescription>
                Let's get connected, we'd love to hear from you!
              </CardDescription>
            </CardHeader>
            <CardContent
              className={`${!directContact ? '' : 'relative flex flex-col p-0 lg:flex-row'}`}
            >
              {/* Social Media Cards Section */}
              <div
                className={`${
                  !directContact
                    ? 'mx-auto flex w-full flex-col sm:w-1/2'
                    : `flex w-full flex-col items-center justify-center p-12 py-6 lg:w-1/3
                      lg:py-12`
                  }`}
              >
                <div
                  className={`${
                    !directContact
                      ? 'grid grid-cols-1 gap-4 lg:grid-cols-2'
                      : 'flex w-full flex-grow flex-col justify-center space-y-2 py-4'
                    }`}
                >
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='lg:last:col-span-2'
                    >
                      <Card
                        className='bg-secondary-foreground transition-all duration-200
                          hover:-translate-y-1 hover:shadow-lg'
                      >
                        <CardHeader className='flex flex-row items-center justify-between
                          space-x-4'>
                          <img
                            src={link.icon}
                            alt={link.title}
                            className='h-12 w-12 not-dark:invert-0 dark:invert-100'
                          />
                          <CardTitle
                            className='text-primary-foreground text-xl font-extralight'
                          >
                            {link.title}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>

              {/* Divider Line */}
              <div
                className={` ${
                  !directContact
                    ? 'hidden'
                    : `bg-muted absolute top-0 bottom-0 left-1/3 my-8 hidden w-0.5
                      lg:block`
                  }`}
              ></div>
              <div
                className={`${!directContact ? 'hidden' : 'bg-muted my-4 block h-0.5 w-full lg:hidden'}
                  `}
              ></div>

              {/* Contact Form Section */}
              <div className={`${!directContact ? 'hidden' : 'w-full p-12 lg:w-2/3'}`}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <h2 className='mb-6 text-center text-3xl font-bold'>
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
                            <Input placeholder='your.email@example.com' {...field} />
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
                      {isCurrentlySubmitting ? 'Sending...' : 'Send Message'}
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

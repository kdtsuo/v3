import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardTitle,
  Button,
  Badge,
  CardHeader,
  CardDescription,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui';
import { Edit, Info } from 'lucide-react';
import { useAuth, useToast, useTheme, useMediaQuery } from '@/hooks';
import { getMonthsAndDaysSince, supabase } from '@/lib';

import defaultSponsors from '@/lib/default';

import { Loader2, SquareArrowOutUpRight, ImageIcon, MapPin } from 'lucide-react';
import { Footer } from '@/components';

import { getMonthsSince } from '@/lib/';
import { SponsorData, SponsorProps } from '@/types';
import * as SponsorActions from '@/components/subcomponents/SponsorActions';

const Sponsor: React.FC<
  SponsorProps & {
    onSponsorUpdated?: () => void;
  }
> = ({
  id,
  image,
  title,
  location,
  maplink,
  text,
  websitelink,
  created_at,
  isAdmin = false,
  onSponsorDeleted = () => {},
  onSponsorUpdated = () => {},
}) => {
  const [imageError, setImageError] = useState(false);
  const { theme } = useTheme();
  const [editOpen, setEditOpen] = useState(false);

  const sponsorData: SponsorData = {
    id,
    image,
    title,
    location,
    maplink,
    text,
    websitelink,
    created_at,
  };

  return (
    <Card
      className='group t200e animate-fade-in relative mx-auto w-full max-w-md gap-0
        overflow-hidden rounded-xl p-0'
    >
      {/* Admin buttons */}
      {isAdmin && id && (
        <>
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
            <SponsorActions.DeleteSponsorDialog
              sponsor={sponsorData}
              onSponsorDeleted={onSponsorDeleted}
            />
          </div>
        </>
      )}
      <Badge
        variant={
          getMonthsSince(created_at) >= 8
            ? 'gold'
            : getMonthsSince(created_at) >= 4
              ? 'platinum'
              : 'silver'
        }
        className='absolute top-2 left-2 z-20'
      >
        {getMonthsSince(created_at)}+
        {getMonthsSince(created_at) === 1 ? ' month' : ' months'}
      </Badge>

      {/* Edit Sponsor Dialog */}
      {isAdmin && id && (
        <SponsorActions.EditSponsorDialog
          open={editOpen}
          setOpen={setEditOpen}
          sponsor={sponsorData}
          onSponsorUpdated={onSponsorUpdated}
        />
      )}

      {/* Sponsor logo area */}
      <div className='relative h-48 overflow-hidden'>
        <div className='block h-full w-full' onClick={(e) => e.stopPropagation()}>
          <div
            className='absolute inset-0 flex items-center justify-center p-6'
            style={{
              background: `var(--bg-xless-dotted-${theme === 'dark' ? 'dark' : 'light'})`,
            }}
          >
            {imageError ? (
              <div className='flex flex-col items-center justify-center'>
                <ImageIcon size={48} className='mb-2 text-gray-300' />
                <span className='text-sm text-gray-500'>{title}</span>
              </div>
            ) : (
              <img
                src={image}
                alt={title}
                className='t200e max-h-32 object-contain group-hover:scale-110'
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sponsor content */}
      <CardContent
        className='bg-muted/20 flex flex-col items-center justify-center space-y-4 p-6
          text-center'
      >
        <CardTitle>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              window.open(websitelink, '_blank');
            }}
            className='w-full'
          >
            <div className='truncate text-lg font-medium md:text-xl'>{title}</div>
            <SquareArrowOutUpRight />
          </Button>
        </CardTitle>
        <Button
          variant='secondary'
          onClick={(e) => {
            e.stopPropagation();
            window.open(maplink, '_blank');
          }}
        >
          <MapPin />
          <div className='text-xs font-medium md:text-sm'>{location}</div>
          <SquareArrowOutUpRight />
        </Button>
        <Badge className='bg-yellow-500 text-sm text-black'>{text}</Badge>
      </CardContent>
    </Card>
  );
};

export default function Sponsors() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const { theme } = useTheme();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const legacySponsors = sponsors.filter((s) => getMonthsSince(s.created_at) >= 8);
  const veteranSponsors = sponsors.filter(
    (s) => getMonthsSince(s.created_at) >= 4 && getMonthsSince(s.created_at) < 8,
  );
  const newSponsors = sponsors.filter((s) => getMonthsSince(s.created_at) < 4);

  const fetchSponsors = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.from('sponsors').select('*').order('title', {
        ascending: true,
      });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setSponsors(data);
      } else {
        setSponsors(defaultSponsors);
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast.error('Failed to load sponsors. Using default data.');
      setSponsors(defaultSponsors);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  const topSponsor = sponsors.length
    ? [...sponsors].sort(
        (a, b) => getMonthsSince(b.created_at) - getMonthsSince(a.created_at),
      )[0]
    : null;

  return (
    <div>
      <section
        id='sponsors'
        className='relative overflow-hidden px-6 pt-30 md:pt-46'
        style={{
          background: `var(--bg-dotted-${theme === 'dark' ? 'dark' : 'light'})`,
        }}
      >
        <div className='relative z-10 mx-auto w-full sm:w-3/4'>
          {/* Top Sponsor Hero Section */}
          {topSponsor && (
            <Card
              className='my-6 flex flex-col items-center gap-8 rounded-xl border-0
                bg-yellow-100/20 p-8 shadow-lg backdrop-blur-sm md:flex-row
                dark:bg-yellow-900/20'
            >
              <div className='flex-shrink-0'>
                <Avatar className='h-32 w-32 border-4 border-yellow-400 shadow'>
                  <AvatarImage src={topSponsor.image} alt={topSponsor.title} />
                  <AvatarFallback
                    className='flex items-center justify-center bg-yellow-300 text-2xl
                      font-bold text-yellow-900'
                  >
                    {topSponsor.title?.charAt(0) ?? '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardContent className='flex-1 text-center md:text-left'>
                <CardTitle
                  className='mb-2 flex items-center justify-center gap-2 text-3xl
                    font-bold text-yellow-700 md:justify-start dark:text-yellow-300'
                >
                  🌟 Top Sponsor: {topSponsor.title}
                </CardTitle>
                <CardDescription
                  className='mb-4 text-lg text-yellow-800 dark:text-yellow-200'
                >
                  <p>
                    Thank you for supporting us for{' '}
                    <span className='font-semibold'>
                      {getMonthsAndDaysSince(topSponsor.created_at).months}{' '}
                      {getMonthsAndDaysSince(topSponsor.created_at).months === 1
                        ? 'month'
                        : 'months'}
                      {', '}
                      {getMonthsAndDaysSince(topSponsor.created_at).days}{' '}
                      {getMonthsAndDaysSince(topSponsor.created_at).days === 1
                        ? 'day'
                        : 'days'}
                    </span>
                  </p>
                  <Badge variant='gold'>{topSponsor.text}</Badge>
                </CardDescription>
                <div
                  className='flex flex-col justify-center gap-3 md:flex-row
                    md:justify-start'
                >
                  <Button
                    variant='default'
                    onClick={() => window.open(topSponsor.websitelink, '_blank')}
                  >
                    Visit Sponsor <SquareArrowOutUpRight />
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => window.open(topSponsor.maplink, '_blank')}
                  >
                    <MapPin />
                    {topSponsor.location}
                    <SquareArrowOutUpRight />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className='flex min-h-[200px] items-center justify-center'>
              <Loader2 className='text-lb-500 h-10 w-10 animate-spin' />
            </div>
          ) : (
            <section>
              {/* Legacy Sponsors */}
              <Card className='w-full'>
                <CardHeader>
                  <CardTitle className='text-3xl'>Sponsors</CardTitle>
                  <CardDescription>
                    Become a sponsor now to help us continue our work!
                  </CardDescription>
                  {/* Admin section for logged in users */}
                  {user && (
                    <div className='mb-4 flex justify-end'>
                      <SponsorActions.AddSponsorDialog onSponsorAdded={fetchSponsors} />
                    </div>
                  )}
                </CardHeader>
                <CardContent className='flex flex-col gap-8'>
                  {/* Legacy Sponsors */}
                  <div>
                    <h1 className='mb-4 flex items-center gap-2 text-2xl font-bold'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='inline-flex cursor-pointer items-center'>
                            Way Paver Sponsors
                            <Info size={20} className='text-muted-foreground ml-2' />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side={isMobile ? 'top' : 'left'} align='center'>
                          Our most dedicated sponsors who have been with us for 8 or more
                          months.
                        </TooltipContent>
                      </Tooltip>
                    </h1>
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3'>
                      {legacySponsors.length === 0 ? (
                        <div className='text-gray-500'>No "Way Paver" sponsors yet.</div>
                      ) : (
                        legacySponsors.map((sponsor, index) => (
                          <Sponsor
                            key={`legacy-${index}`}
                            {...sponsor}
                            isAdmin={!!user}
                            onSponsorDeleted={fetchSponsors}
                            onSponsorUpdated={fetchSponsors}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Veteran Sponsors */}
                  <div>
                    <h1 className='mb-4 flex items-center gap-2 text-2xl font-bold'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='inline-flex cursor-pointer items-center'>
                            Rising Stars Sponsors
                            <Info size={20} className='text-muted-foreground ml-2' />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side={isMobile ? 'top' : 'left'}>
                          Sponsors who have been with us for 4-7 months.
                        </TooltipContent>
                      </Tooltip>
                    </h1>
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3'>
                      {veteranSponsors.length === 0 ? (
                        <div className='text-gray-500'>No rising star sponsors yet.</div>
                      ) : (
                        veteranSponsors.map((sponsor, index) => (
                          <Sponsor
                            key={`veteran-${index}`}
                            {...sponsor}
                            isAdmin={!!user}
                            onSponsorDeleted={fetchSponsors}
                            onSponsorUpdated={fetchSponsors}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* New Sponsors */}
                  <div>
                    <h1 className='mb-4 flex items-center gap-2 text-2xl font-bold'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='inline-flex cursor-pointer items-center'>
                            Debut Sponsors
                            <Info size={20} className='text-muted-foreground ml-2' />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side={isMobile ? 'top' : 'left'}>
                          Sponsors who joined us within the last 3 months.
                        </TooltipContent>
                      </Tooltip>
                    </h1>
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3'>
                      {newSponsors.length === 0 ? (
                        <div className='text-gray-500'>No debut sponsors yet.</div>
                      ) : (
                        newSponsors.map((sponsor, index) => (
                          <Sponsor
                            key={`new-${index}`}
                            {...sponsor}
                            isAdmin={!!user}
                            onSponsorDeleted={fetchSponsors}
                            onSponsorUpdated={fetchSponsors}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

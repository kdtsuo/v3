import React, { useState, useEffect, useCallback } from "react";
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
} from "@/components/ui";
import { Edit, Info } from "lucide-react";
import { useAuth, useToast, useTheme, useMediaQuery } from "@/hooks";
import { supabase } from "@/lib";

import defaultSponsors from "@/lib/default";

import {
  Loader2,
  SquareArrowOutUpRight,
  ImageIcon,
  MapPin,
} from "lucide-react";
import { Footer } from "@/components";

import { getMonthsSince } from "@/lib/";
import { SponsorData, SponsorProps } from "@/types";
import * as SponsorActions from "@/components/subcomponents/SponsorActions";

const Sponsor: React.FC<SponsorProps & { onSponsorUpdated?: () => void }> = ({
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
    <Card className='group relative overflow-hidden gap-0 rounded-xl t200e animate-fade-in w-full max-w-md mx-auto p-0 '>
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
            ? "gold"
            : getMonthsSince(created_at) >= 4
            ? "platinum"
            : "silver"
        }
        className='absolute top-2 left-2 z-20'
      >
        {getMonthsSince(created_at)}+
        {getMonthsSince(created_at) === 1 ? " month" : " months"}
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
            className='w-full'
          >
            <div className='text-lg md:text-xl font-medium truncate'>
              {title}
            </div>
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

// Sponsors Page Component
export default function Sponsors() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const { theme } = useTheme();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const legacySponsors = sponsors.filter(
    (s) => getMonthsSince(s.created_at) >= 8
  );
  const veteranSponsors = sponsors.filter(
    (s) => getMonthsSince(s.created_at) >= 4 && getMonthsSince(s.created_at) < 8
  );
  const newSponsors = sponsors.filter((s) => getMonthsSince(s.created_at) < 4);

  const fetchSponsors = useCallback(async () => {
    setIsLoading(true);

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
  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  return (
    <div>
      <section
        id='sponsors'
        className='relative overflow-hidden px-6 pt-30 md:pt-46'
        style={{
          background: `var(--bg-dotted-${theme === "dark" ? "dark" : "light"})`,
        }}
      >
        <div className='w-full sm:w-3/4 mx-auto relative z-10'>
          {/* Admin section for logged in users */}
          {user && (
            <div className='mb-10 pt-10 flex justify-end'>
              <SponsorActions.AddSponsorDialog onSponsorAdded={fetchSponsors} />
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className='flex justify-center items-center min-h-[200px]'>
              <Loader2 className='h-10 w-10 animate-spin text-lb-500' />
            </div>
          ) : (
            <section>
              {/* Legacy Sponsors */}
              <Card className='w-full'>
                <CardHeader>
                  <CardTitle className='text-3xl'>Sponsors</CardTitle>
                  <CardDescription>
                    Our sponsors play a crucial role in supporting our mission
                    and helping us achieve our goals at KDT. Become a sponsor
                    now to help us continue our work!
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-8'>
                  {/* Legacy Sponsors */}
                  <div>
                    <h1 className='text-2xl font-bold mb-4 flex items-center gap-2'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='inline-flex items-center cursor-pointer'>
                            Way Paver Sponsors
                            <Info
                              size={20}
                              className='ml-2 text-muted-foreground'
                            />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side={isMobile ? "top" : "left"}
                          align='center'
                        >
                          Our most dedicated sponsors who have been with us for
                          8 or more months.
                        </TooltipContent>
                      </Tooltip>
                    </h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                      {legacySponsors.length === 0 ? (
                        <div className='text-gray-500'>
                          No "Way Paver" sponsors yet.
                        </div>
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
                    <h1 className='text-2xl font-bold mb-4 flex items-center gap-2'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='inline-flex items-center cursor-pointer'>
                            Rising Stars Sponsors
                            <Info
                              size={20}
                              className='ml-2 text-muted-foreground'
                            />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side={isMobile ? "top" : "left"}>
                          Sponsors who have been with us for 4-7 months.
                        </TooltipContent>
                      </Tooltip>
                    </h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                      {veteranSponsors.length === 0 ? (
                        <div className='text-gray-500'>
                          No rising star sponsors yet.
                        </div>
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
                    <h1 className='text-2xl font-bold mb-4 flex items-center gap-2'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='inline-flex items-center cursor-pointer'>
                            Debut Sponsors
                            <Info
                              size={20}
                              className='ml-2 text-muted-foreground'
                            />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side={isMobile ? "top" : "left"}>
                          Sponsors who joined us within the last 3 months.
                        </TooltipContent>
                      </Tooltip>
                    </h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                      {newSponsors.length === 0 ? (
                        <div className='text-gray-500'>
                          No debut sponsors yet.
                        </div>
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

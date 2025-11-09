import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardTitle, Button, Badge } from "@/components/ui";
import { Edit } from "lucide-react";
import { useAuth, useToast, useTheme } from "@/hooks";
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
      <Badge variant='green' className='absolute top-2 left-2 z-20'>
        {getMonthsSince(created_at) >= 4 ? (
          <>Legacy Sponsor for {getMonthsSince(created_at)}+ months</>
        ) : (
          <>Sponsor for {getMonthsSince(created_at)} months</>
        )}
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
        className='relative overflow-hidden px-10 pt-30 md:pt-46'
        style={{
          background: `var(--bg-dotted-${theme === "dark" ? "dark" : "light"})`,
        }}
      >
        <div className='max-w-6xl mx-auto relative z-10'>
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
                  created_at={sponsor.created_at}
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

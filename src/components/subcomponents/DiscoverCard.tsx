import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DiscoverCardProps {
  className?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  image: string;
  link: string;
  isOpen: boolean;
}

export default function DiscoverCard({
  className,
  icon: Icon,
  title,
  description,
  image,
  link,
  isOpen,
}: DiscoverCardProps) {
  return (
    <Link
      to={link}
      className={`block t200e ${
        !isOpen ? "opacity-50" : "opacity-100"
      } ${className}`}
    >
      <Card className='group h-full border-ring overflow-hidden relative shadow-lg t200e'>
        {/* Background image */}
        <div
          className='absolute inset-0 bg-cover bg-center t200e'
          style={{ backgroundImage: `url(${image})` }}
        />

        {/* Dark overlay */}
        <div className='absolute inset-0 bg-black opacity-75 group-hover:opacity-60 t200e' />

        {/* Dot pattern overlay - only visible on hover */}
        <div className='absolute inset-0 opacity-25 group-hover:opacity-40 t200e' />

        {/* Content */}
        <div className='relative z-10 flex flex-col items-center justify-center text-center h-full p-6'>
          <CardHeader className='pb-2'>
            {Icon && (
              <Icon size={30} strokeWidth={2} className='mx-auto text-white' />
            )}
            <CardTitle className='text-2xl md:text-3xl font-bold text-white'>
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <CardDescription className='text-md md:text-xl text-gray-200 t200e'>
              {description}
            </CardDescription>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

interface IconLink {
  href: string;
  imgSrc: string;
  alt: string;
}

interface IconLinkProps {
  links: IconLink[];
}

export default function IconLink({ links }: IconLinkProps) {
  return (
    <div className='grid grid-cols-2 gap-2 justify-items-center w-full mx-auto '>
      {links.map((link, index) => (
        <a
          key={index}
          target='_blank'
          rel='noreferrer'
          href={link.href}
          className='nudgeup fadein80 t200e'
        >
          <img
            className='w-14 h-auto m-2 dark:invert-0 not-dark:invert-100'
            src={link.imgSrc}
            alt={link.alt}
          />
        </a>
      ))}
    </div>
  );
}

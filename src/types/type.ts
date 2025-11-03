// src/components/type.ts
// Abstracted types for component interfaces

export type Link = {
  id?: number; // Supabase will provide this
  iconType: string;
  label: string;
  link: string;
  isOpen: boolean;
  date: string;
  price?: number;
};

export type IconLinkWideProps = {
  iconType?: string;
  label: string;
  link: string;
  className?: string;
  isOpen?: boolean;
  date?: string;
  onDelete?: () => void;
  deleteMode?: boolean;
  price?: number;
};

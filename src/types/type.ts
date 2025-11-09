// src/types/type.ts
// Centralized type definitions for the application

import { Session, User } from '@supabase/supabase-js';
import { LucideIcon } from 'lucide-react';
import { ExternalToast, toast as sonnerToast } from 'sonner';

// ============================================================================
// COMMON TYPES
// ============================================================================

export type ActionType = 'update' | 'add' | 'delete' | 'reorder' | null;

// ============================================================================
// LINK TYPES
// ============================================================================

export type Link = {
  id?: number; // Supabase will provide this
  iconType: string;
  label: string;
  link: string;
  date: string;
  price?: number;
  order?: number; // For reordering links
};

export type IconLinkWideProps = {
  iconType?: string;
  label: string;
  link: string;
  className?: string;
  date?: string;
  onDelete?: () => void;
  deleteMode?: boolean;
  price?: number;
  style?: React.CSSProperties;
};

// ============================================================================
// PAGE-SPECIFIC TYPES
// ============================================================================

// Positions Page
export type Position = {
  label: string;
  form_url: string;
  is_accepting_responses: boolean;
};

// Contacts Page
export interface SocialLink {
  icon: string;
  href: string;
  title: string;
}

// Sponsors Page
export interface SponsorData {
  id?: string;
  image: string;
  title: string;
  location: string;
  maplink: string;
  text: string;
  websitelink: string;
  created_at: string | undefined;
}

export interface SponsorProps {
  id?: string;
  image: string;
  title: string;
  location: string;
  maplink: string;
  text: string;
  websitelink: string;
  isAdmin?: boolean;
  created_at?: string;
  onSponsorDeleted?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteMode?: boolean;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

// Theme Context
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Auth Context
export type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
};

// Toast Context
export interface ToastContextType {
  toast: {
    success: (message: string, data?: ExternalToast) => void;
    error: (message: string, data?: ExternalToast) => void;
    info: (message: string, data?: ExternalToast) => void;
    warning: (message: string, data?: ExternalToast) => void;
    promise: typeof sonnerToast.promise;
    custom: typeof sonnerToast.custom;
    message: typeof sonnerToast.message;
    loading: typeof sonnerToast.loading;
    dismiss: typeof sonnerToast.dismiss;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Icon Map
export interface IconMapItem {
  iconComponent?: LucideIcon;
  imagePath?: string;
}

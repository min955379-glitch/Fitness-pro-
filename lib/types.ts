export type SiteSettings = {
  gym_name: string
  email: string
  phone: string
  whatsapp: string
  address: string
  city: string
  weekday_hours: string
  weekend_hours: string
  facebook?: string | null
  instagram?: string | null
  tiktok?: string | null
  youtube?: string | null
  hero_kicker: string
  hero_title: string
  hero_copy: string
  active_members_label: string
  trainers_label: string
  years_label: string
  story_title: string
  story_body: string
  mission: string
  vision: string
  values_copy: string
  founder_name: string
  founder_note: string
  certifications: string
  footer_copy: string
}

export type MembershipPlan = {
  id: string
  slug: string
  name: string
  price: number | null
  billing_period: string
  tagline: string | null
  features: string[]
  is_popular: boolean
  is_active: boolean
  sort_order: number
}

export type DietPlan = {
  id: string
  slug: string
  name: string
  price: number | null
  was_price: number | null
  blurb: string | null
  is_active: boolean
  sort_order: number
}

export type PricingRate = { key: string; label: string; amount: number; sort_order: number }
export type DurationPrice = {
  id: string
  label: string
  months: number
  bronze_price: number
  silver_price: number
  gold_price: number
  sort_order: number
  is_active: boolean
}

export type Trainer = {
  id: string
  name: string
  slug?: string | null
  specialty?: string | null
  bio?: string | null
  image_url?: string | null
  certifications?: string[]
  experience_years?: number
  instagram?: string | null
  facebook?: string | null
  youtube?: string | null
  tiktok?: string | null
  is_featured?: boolean
  is_visible: boolean
  sort_order?: number
}

export type GalleryItem = {
  id: string
  image_url: string
  category: string
  caption?: string | null
  sort_order: number
  is_active: boolean
}

export type Member = {
  id: string
  auth_user_id: string | null
  full_name: string
  email: string | null
  phone: string
  plan_id: string | null
  join_date: string | null
  expiry_date: string | null
  custom_duration_months: number | null
  admission_fee_paid: boolean
  notes: string | null
  membership_status: 'active' | 'expired' | 'removed'
  approval_status: 'pending' | 'approved' | 'rejected'
  approved_at: string | null
  created_at: string
  membership_plans?: { name: string; price?: number | null } | null
}

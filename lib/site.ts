import {unstable_cache} from 'next/cache'
import {redirect} from 'next/navigation'
import {createClient as createPublicSupabaseClient} from '@supabase/supabase-js'
import {createClient} from './supabase-server'
import {defaultDietPlans, defaultDurations, defaultGallery, defaultPlans, defaultRates, defaultSettings} from './data'
import type {DietPlan, DurationPrice, GalleryItem, Member, MembershipPlan, PricingRate, SiteSettings, Trainer} from './types'

export const PUBLIC_DATA_TAG = 'fitness-pro-public-data'

const fetchPublicData = unstable_cache(async () => {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if(!url||!key)return {settings:defaultSettings,plans:defaultPlans,dietPlans:defaultDietPlans,rates:defaultRates,durations:defaultDurations,trainers:[] as Trainer[],gallery:defaultGallery}
  const supabase = createPublicSupabaseClient(
    url,
    key,
    {auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}}
  )
  const [settingsResult,plansResult,dietResult,ratesResult,durationsResult,trainersResult,galleryResult] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id',true).maybeSingle(),
    supabase.from('membership_plans').select('*').eq('is_active',true).order('sort_order'),
    supabase.from('diet_plans').select('*').eq('is_active',true).order('sort_order'),
    supabase.from('pricing_rates').select('*').order('sort_order'),
    supabase.from('duration_prices').select('*').eq('is_active',true).order('sort_order'),
    supabase.from('trainers').select('*').eq('is_visible',true).order('sort_order'),
    supabase.from('gallery_items').select('*').eq('is_active',true).order('sort_order'),
  ])
  const settings = {...defaultSettings,...(settingsResult.data ?? {})} as SiteSettings
  return {
    settings,
    plans: (plansResult.data?.length ? plansResult.data : defaultPlans) as MembershipPlan[],
    dietPlans: (dietResult.data?.length ? dietResult.data : defaultDietPlans) as DietPlan[],
    rates: (ratesResult.data?.length ? ratesResult.data : defaultRates) as PricingRate[],
    durations: (durationsResult.data?.length ? durationsResult.data : defaultDurations) as DurationPrice[],
    trainers: (trainersResult.data ?? []) as Trainer[],
    gallery: (galleryResult.data?.length ? galleryResult.data : defaultGallery) as GalleryItem[],
  }
}, ['fitness-pro-public-data-v2'], {revalidate:300,tags:[PUBLIC_DATA_TAG]})

export async function getPublicData(){
  return fetchPublicData()
}

export async function getSessionUser(){
  const supabase = await createClient()
  const {data:{user}} = await supabase.auth.getUser()
  return {supabase,user}
}

export async function requireAdmin(){
  const {supabase,user} = await getSessionUser()
  if(!user) redirect('/admin/login')
  const {data:isAdmin,error} = await supabase.rpc('is_admin')
  const legacyOwner = user.email?.toLowerCase() === 'min955378@gmail.com'
  if((error && !legacyOwner) || (!isAdmin && !legacyOwner)) redirect('/member')
  return {supabase,user}
}

export async function requireMember(){
  const {supabase,user} = await getSessionUser()
  if(!user) redirect('/login')
  const {data:isAdmin} = await supabase.rpc('is_admin')
  const {data:member,error} = await supabase.from('members').select('*, membership_plans(name,price)').eq('auth_user_id',user.id).maybeSingle()
  if((error || !member) && isAdmin){
    const fallback: Member = {id:user.id,auth_user_id:user.id,full_name:user.user_metadata?.full_name || user.email?.split('@')[0] || 'Administrator',email:user.email ?? null,phone:'',plan_id:null,join_date:null,expiry_date:null,custom_duration_months:null,admission_fee_paid:false,notes:null,membership_status:'active',approval_status:'approved',approved_at:null,created_at:user.created_at,membership_plans:null}
    return {supabase,user,member:fallback,isAdmin:true}
  }
  if(error || !member) redirect('/register?profile=missing')
  return {supabase,user,member:member as unknown as Member,isAdmin:Boolean(isAdmin)}
}

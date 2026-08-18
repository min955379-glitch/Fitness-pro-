import type {DietPlan, DurationPrice, GalleryItem, MembershipPlan, PricingRate, SiteSettings} from './types'

export const defaultSettings: SiteSettings = {
  gym_name: 'Fitness Pro',
  email: 'min955378@gmail.com',
  phone: '0348 5581969',
  whatsapp: '923485581969',
  address: '5752+WRX, Orish Colony Rd, Nawan Shehr Town, Abbottabad, Pakistan',
  city: 'Abbottabad',
  weekday_hours: '6:00 AM – 10:00 AM and 3:00 PM – 11:30 PM',
  weekend_hours: 'Closed',
  hero_kicker: "ABBOTTABAD'S STRENGTH COMMUNITY",
  hero_title: 'TRAIN STRONG. LIVE STRONGER.',
  hero_copy: 'Purposeful training, modern equipment and a team that knows your name.',
  active_members_label: '500+',
  trainers_label: '10+',
  years_label: '5+',
  story_title: 'Built for consistent progress',
  story_body: 'Fitness Pro is a focused training space for Abbottabad. We combine quality equipment, practical coaching and a respectful community so every member can train with confidence.',
  mission: 'Make structured, high-quality fitness accessible to our local community.',
  vision: "Build Abbottabad's most trusted strength and wellness community.",
  values_copy: 'Discipline, respect, progress and honest coaching guide everything we do.',
  founder_name: 'Fitness Pro Team',
  founder_note: 'Local coaches committed to helping members build lasting habits.',
  certifications: 'Qualified coaching • Safe training practices • Member-first support',
  footer_copy: 'Train with purpose. Progress with confidence.',
}

export const defaultPlans: MembershipPlan[] = [
  {id:'bronze',slug:'bronze',name:'Bronze',price:1500,billing_period:'Monthly',tagline:'A focused start',features:['Gym access','Cross training','Workout guidance'],is_popular:false,is_active:true,sort_order:10},
  {id:'silver',slug:'silver',name:'Silver',price:2000,billing_period:'Monthly',tagline:'More structure, more support',features:['Full gym access','Cross training','Workout plan','Basic coaching'],is_popular:true,is_active:true,sort_order:20},
  {id:'gold',slug:'gold',name:'Gold',price:6500,billing_period:'Monthly',tagline:'Complete coaching support',features:['Full gym access','Diet plan','Workout plan','Cross training','Personal training'],is_popular:false,is_active:true,sort_order:30},
]
export const defaultDietPlans: DietPlan[] = [
  {id:'basic',slug:'basic',name:'Basic',price:500,was_price:null,blurb:'A practical starter nutrition guide for better daily choices.',is_active:true,sort_order:10},
  {id:'premium',slug:'premium',name:'Premium',price:3000,was_price:null,blurb:'Personalized nutrition support aligned with your training goal.',is_active:true,sort_order:20},
]
export const defaultRates: PricingRate[] = [
  {key:'daily_without_training',label:'Daily • Gym access',amount:200,sort_order:10},
  {key:'daily_with_training',label:'Daily • With training',amount:300,sort_order:20},
  {key:'weekly_without_training',label:'Weekly • Gym access',amount:600,sort_order:30},
  {key:'weekly_with_training',label:'Weekly • With training',amount:700,sort_order:40},
]
export const defaultDurations: DurationPrice[] = [
  {id:'3-months',label:'3 Months',months:3,bronze_price:4000,silver_price:5000,gold_price:18500,sort_order:10,is_active:true},
  {id:'6-months',label:'6 Months',months:6,bronze_price:8000,silver_price:10000,gold_price:35000,sort_order:20,is_active:true},
  {id:'1-year',label:'1 Year',months:12,bronze_price:15000,silver_price:20000,gold_price:70000,sort_order:30,is_active:true},
]
export const defaultGallery: GalleryItem[] = [
  {id:'floor',image_url:'/images/fitness-pro-floor.jpg',category:'Gym Floor',caption:'A training floor built for focused work.',sort_order:10,is_active:true},
  {id:'strength',image_url:'/images/fitness-pro-strength.jpg',category:'Strength',caption:'Quality strength equipment for progressive training.',sort_order:20,is_active:true},
  {id:'cardio',image_url:'/images/fitness-pro-cardio.jpg',category:'Cardio',caption:'Conditioning equipment for every pace.',sort_order:30,is_active:true},
  {id:'facility',image_url:'/images/fitness-pro-hero.jpg',category:'Facility',caption:'Purposeful design, serious training.',sort_order:40,is_active:true},
]

export const trainingGoals = [
  {title:'Build Strength',copy:'Progressive training and quality equipment for measurable gains.',image:'/images/fitness-pro-strength.jpg'},
  {title:'Improve Fitness',copy:'Build stamina, mobility and everyday energy at your pace.',image:'/images/fitness-pro-cardio.jpg'},
  {title:'Train Consistently',copy:'A focused environment and practical guidance that keep you moving.',image:'/images/fitness-pro-floor.jpg'},
]

export const formatPKR = (value:number|null|undefined) => value == null ? 'Contact us' : `Rs ${Number(value).toLocaleString('en-PK')}`

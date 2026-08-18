import Link from 'next/link'
import {Facebook,Instagram,Mail,MapPin,Phone,Youtube} from 'lucide-react'
import type {ReactNode} from 'react'
import type {SiteSettings} from '@/lib/types'
import {createClient} from '@/lib/supabase-server'
import {Logo} from './logo'
import {NewsletterForm} from './newsletter-form'
import {SiteHeader} from './site-header'

export async function SiteShell({settings,children}:{settings:SiteSettings;children:ReactNode}){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();let isAdmin=false
 if(user){const {data}=await supabase.rpc('is_admin');isAdmin=Boolean(data)||user.email?.toLowerCase()==='min955378@gmail.com'}
 const userName=user?.user_metadata?.full_name || user?.email?.split('@')[0]
 const socials=[{href:settings.instagram,icon:Instagram,label:'Instagram'},{href:settings.facebook,icon:Facebook,label:'Facebook'},{href:settings.youtube,icon:Youtube,label:'YouTube'}].filter(x=>x.href)
 return <><SiteHeader userName={userName} isAdmin={isAdmin}/>{children}<footer className="siteFooter"><div className="container footerGrid"><div><Logo/><p>{settings.footer_copy}</p><div className="socialRow">{socials.map(({href,icon:Icon,label})=><a key={label} href={href!} target="_blank" rel="noreferrer" aria-label={label}><Icon size={18}/></a>)}</div></div><div><h3>Explore</h3><Link href="/about">About</Link><Link href="/#plans">Memberships</Link><Link href="/trainers">Trainers</Link><Link href="/gallery">Gallery</Link></div><div><h3>Contact</h3><a href={`tel:${settings.phone.replace(/\s/g,'')}`}><Phone size={15}/>{settings.phone}</a><a href={`mailto:${settings.email}`}><Mail size={15}/>{settings.email}</a><span><MapPin size={15}/>{settings.city}</span></div><NewsletterForm/></div><div className="container footerBottom"><span>© {new Date().getFullYear()} Fitness Pro. All rights reserved.</span><span>Abbottabad, Pakistan</span></div></footer></>
}

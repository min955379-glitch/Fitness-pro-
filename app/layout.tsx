import './globals.css'
import type {Metadata,Viewport} from 'next'
import type {ReactNode} from 'react'
export const metadata:Metadata={metadataBase:new URL('https://fitness-pro-kappa.vercel.app'),title:{default:'Fitness Pro | Gym & Fitness Center Abbottabad',template:'%s | Fitness Pro'},description:'Purposeful training, modern equipment and practical coaching at Fitness Pro in Abbottabad.',openGraph:{title:'Fitness Pro Abbottabad',description:'Train strong. Live stronger.',type:'website',images:['/images/fitness-pro-hero.jpg']},icons:{icon:'/fitness-pro-logo.svg'}}
export const viewport:Viewport={themeColor:'#f4c430',colorScheme:'dark light',width:'device-width',initialScale:1}
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en" data-theme="dark"><body>{children}</body></html>}

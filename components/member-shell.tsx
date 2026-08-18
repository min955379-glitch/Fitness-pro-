'use client'
import Link from 'next/link'
import {CalendarDays,ChevronDown,ClipboardCheck,History,LayoutDashboard,Menu,Settings,WalletCards,X} from 'lucide-react'
import {usePathname} from 'next/navigation'
import {useState} from 'react'
import {Logo} from './logo'
import {SignOutButton} from './sign-out-button'
const links=[['/member','Overview',LayoutDashboard],['/member/attendance','Today',ClipboardCheck],['/member/attendance-history','History',History],['/member/calendar','Calendar',CalendarDays],['/payment','Payments',WalletCards],['/member/settings','Settings',Settings]] as const
export function MemberShell({name,isAdmin,children}:{name:string;isAdmin:boolean;children:React.ReactNode}){const path=usePathname();const [open,setOpen]=useState(false);return <div className="memberApp"><header className="memberHeader"><div className="container"><Logo/><button className="iconButton memberMenu" onClick={()=>setOpen(!open)} aria-label="Toggle member menu">{open?<X/>:<Menu/>}</button><nav className={open?'isOpen':''}>{links.map(([href,label,Icon])=><Link onClick={()=>setOpen(false)} className={path===href?'active':''} href={href} key={href}><Icon size={16}/>{label}</Link>)}{isAdmin&&<Link href="/admin/dashboard">Admin</Link>}</nav><div className="memberAccount"><span>{name}<ChevronDown size={14}/></span><SignOutButton compact/></div></div></header><main className="memberMain"><div className="container">{children}</div></main></div>}

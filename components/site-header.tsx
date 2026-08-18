'use client'
import Link from 'next/link'
import {Menu,X} from 'lucide-react'
import {useState} from 'react'
import {Logo} from './logo'

export function SiteHeader(){
  const [open,setOpen]=useState(false)
  const close=()=>setOpen(false)
  return <header className="siteHeader">
    <div className="container headerInner">
      <Logo/>
      <button className="iconButton mobileMenuButton" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      <nav className={`mainNav ${open?'isOpen':''}`} aria-label="Main navigation">
        <Link onClick={close} href="/about">About</Link>
        <Link onClick={close} href="/#plans">Memberships</Link>
        <Link onClick={close} href="/trainers">Trainers</Link>
        <Link onClick={close} href="/gallery">Gallery</Link>
        <Link onClick={close} href="/contact">Contact</Link>
        <Link onClick={close} href="/login">Member login</Link>
        <Link onClick={close} className="button buttonSmall" href="/register">Join now</Link>
      </nav>
    </div>
  </header>
}

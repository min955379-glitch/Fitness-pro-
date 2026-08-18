import Image from 'next/image'
import Link from 'next/link'
import type {ReactNode} from 'react'
import {Logo} from './logo'
export function AuthPage({eyebrow,title,copy,children,footer}:{eyebrow:string;title:string;copy:string;children:ReactNode;footer?:ReactNode}){return <main className="authPage"><div className="authVisual"><Image src="/images/fitness-pro-hero.jpg" alt="Fitness Pro training space" fill priority sizes="(max-width: 900px) 0vw, 45vw"/><div/><div className="authLogo"><Logo/></div><blockquote>“Consistency changes more than intensity ever will.”<span>Fitness Pro • Abbottabad</span></blockquote></div><section className="authPanel"><Link className="authBack" href="/">← Back to website</Link><div className="authCard"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p>{children}{footer&&<div className="authFooter">{footer}</div>}</div></section></main>}

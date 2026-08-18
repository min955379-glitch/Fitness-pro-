import Link from 'next/link'
import type {ReactNode} from 'react'
export function PageHero({eyebrow,title,copy,actions}:{eyebrow:string;title:string;copy?:string;actions?:ReactNode}){return <section className="pageHero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{copy&&<p>{copy}</p>}{actions&&<div className="buttonRow">{actions}</div>}</div></section>}
export function SectionHeading({eyebrow,title,copy,action}:{eyebrow?:string;title:string;copy?:string;action?:ReactNode}){return <div className="sectionHeading"><div>{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{copy&&<p>{copy}</p>}</div>{action}</div>}
export function StatusPill({value}:{value:string}){return <span className={`status status-${value.toLowerCase().replace(/\s+/g,'-')}`}>{value.replace(/_/g,' ')}</span>}
export function EmptyState({title,copy,href,label}:{title:string;copy:string;href?:string;label?:string}){return <div className="emptyState"><h3>{title}</h3><p>{copy}</p>{href&&label&&<Link className="button buttonGhost" href={href}>{label}</Link>}</div>}
export function Notice({kind='info',children}:{kind?:'info'|'success'|'warning'|'error';children:ReactNode}){return <div className={`notice notice-${kind}`} role={kind==='error'?'alert':'status'}>{children}</div>}

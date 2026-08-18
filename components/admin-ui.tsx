'use client'
import {useFormStatus} from 'react-dom'
import type {ReactNode} from 'react'
export function AdminPageHeading({eyebrow,title,copy,actions}:{eyebrow?:string;title:string;copy?:string;actions?:ReactNode}){return <div className="adminPageHeading"><div>{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{copy&&<p>{copy}</p>}</div>{actions&&<div className="buttonRow">{actions}</div>}</div>}
export function SubmitButton({children,className='button buttonSmall',confirm}:{children:ReactNode;className?:string;confirm?:string}){const {pending}=useFormStatus();return <button type="submit" className={className} disabled={pending} onClick={e=>{if(confirm&&!window.confirm(confirm))e.preventDefault()}}>{pending?'Working…':children}</button>}

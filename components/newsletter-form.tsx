'use client'
import {useState} from 'react'
import {createClient} from '@/lib/supabase-browser'
export function NewsletterForm(){
 const [email,setEmail]=useState(''),[state,setState]=useState<'idle'|'sending'|'done'|'error'>('idle')
 async function submit(e:React.FormEvent){e.preventDefault();setState('sending');const {error}=await createClient().from('newsletter_subscribers').upsert({email:email.trim().toLowerCase(),is_active:true},{onConflict:'email'});if(error){setState('error')}else{setEmail('');setState('done')}}
 return <form className="newsletter" onSubmit={submit}><label htmlFor="newsletter-email">Training tips. Zero spam.</label><div><input id="newsletter-email" type="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address"/><button disabled={state==='sending'}>{state==='sending'?'…':'Subscribe'}</button></div><span aria-live="polite">{state==='done'?'You are on the list.':state==='error'?'Subscriptions will be available after the database upgrade.':''}</span></form>
}

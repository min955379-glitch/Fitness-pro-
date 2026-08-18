'use client'
import {LogOut} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {createClient} from '@/lib/supabase-browser'
export function SignOutButton({compact=false}:{compact?:boolean}){const router=useRouter();async function signOut(){const supabase=createClient();await supabase.rpc('log_auth_event',{p_event:'logout',p_email:null});await supabase.auth.signOut();router.replace('/');router.refresh()}return <button type="button" className={compact?'iconButton':'navAction'} onClick={signOut} title="Sign out"><LogOut size={17}/>{!compact&&'Sign out'}</button>}

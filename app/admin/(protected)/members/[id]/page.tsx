import Link from 'next/link'
import {notFound} from 'next/navigation'
import {CalendarClock} from 'lucide-react'
import {AdminPageHeading} from '@/components/admin-ui'
import {MemberForm} from '@/components/member-form'
import {Notice} from '@/components/ui'
import {requireAdmin} from '@/lib/site'
import type {Member,MembershipPlan} from '@/lib/types'
export const metadata={title:'Edit Member | Fitness Pro Admin'}
export default async function EditMember({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{saved?:string;created?:string}>}){const [{supabase},route,query]=await Promise.all([requireAdmin(),params,searchParams]);const [{data:member},{data:plans}]=await Promise.all([supabase.from('members').select('*').eq('id',route.id).maybeSingle(),supabase.from('membership_plans').select('*').order('sort_order')]);if(!member)notFound();return <>{(query.saved||query.created)&&<Notice kind="success">Member record saved.</Notice>}<AdminPageHeading eyebrow="Member directory" title={member.full_name} copy="Update membership, approval, account details and internal notes." actions={<><Link className="button buttonGhost" href={`/admin/members/${member.id}/attendance`}><CalendarClock/>Attendance</Link><Link className="button buttonGhost" href="/admin/members">Back</Link></>}/><MemberForm member={member as Member} plans={(plans||[]) as MembershipPlan[]}/></>}

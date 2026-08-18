import {notFound} from 'next/navigation'
import {AdminPageHeading} from '@/components/admin-ui'
import {PlanForm} from '@/components/plan-form'
import {requireAdmin} from '@/lib/site'
import type {MembershipPlan} from '@/lib/types'
export default async function EditPlan({params}:{params:Promise<{id:string}>}){const [{supabase},route]=await Promise.all([requireAdmin(),params]);const {data}=await supabase.from('membership_plans').select('*').eq('id',route.id).maybeSingle();if(!data)notFound();return <><AdminPageHeading eyebrow="Membership plans" title={`Edit ${data.name}`} copy="Changes appear on the public website after saving."/><PlanForm plan={data as MembershipPlan}/></>}

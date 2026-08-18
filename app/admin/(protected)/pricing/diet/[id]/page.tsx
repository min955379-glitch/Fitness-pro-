import {notFound} from 'next/navigation'
import {AdminPageHeading} from '@/components/admin-ui'
import {DietPlanForm} from '@/components/diet-plan-form'
import {requireAdmin} from '@/lib/site'
import type {DietPlan} from '@/lib/types'
export default async function EditDietPlan({params}:{params:Promise<{id:string}>}){const [{supabase},route]=await Promise.all([requireAdmin(),params]);const {data}=await supabase.from('diet_plans').select('*').eq('id',route.id).maybeSingle();if(!data)notFound();return <><AdminPageHeading eyebrow="Pricing" title={`Edit ${data.name}`} copy="Update pricing, promotion and visibility."/><DietPlanForm plan={data as DietPlan}/></>}

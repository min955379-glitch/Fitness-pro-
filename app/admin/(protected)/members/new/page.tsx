import Link from 'next/link'
import {AdminPageHeading} from '@/components/admin-ui'
import {MemberForm} from '@/components/member-form'
import {requireAdmin} from '@/lib/site'
import type {MembershipPlan} from '@/lib/types'
export const metadata={title:'Add Member | Fitness Pro Admin'}
export default async function NewMember(){const {supabase}=await requireAdmin();const {data}=await supabase.from('membership_plans').select('*').order('sort_order');return <><AdminPageHeading eyebrow="Member directory" title="Add member" copy="Create a record for a walk-in member. Online account linkage remains optional." actions={<Link className="button buttonGhost" href="/admin/members">Cancel</Link>}/><MemberForm plans={(data||[]) as MembershipPlan[]}/></>}

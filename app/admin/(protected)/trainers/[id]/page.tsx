import {notFound} from 'next/navigation'
import {AdminPageHeading} from '@/components/admin-ui'
import {TrainerForm} from '@/components/trainer-form'
import {requireAdmin} from '@/lib/site'
import type {Trainer} from '@/lib/types'
export default async function EditTrainer({params}:{params:Promise<{id:string}>}){const [{supabase},route]=await Promise.all([requireAdmin(),params]);const {data}=await supabase.from('trainers').select('*').eq('id',route.id).maybeSingle();if(!data)notFound();return <><AdminPageHeading eyebrow="Coaching team" title={`Edit ${data.name}`} copy="Update public content and visibility."/><TrainerForm trainer={data as Trainer}/></>}

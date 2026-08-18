import type {ReactNode} from 'react'
import {MemberShell} from '@/components/member-shell'
import {requireMember} from '@/lib/site'
export default async function MemberLayout({children}:{children:ReactNode}){const {member,isAdmin}=await requireMember();return <MemberShell name={member.full_name} isAdmin={isAdmin}>{children}</MemberShell>}

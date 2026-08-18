import {MemberSettingsForm} from '@/components/member-settings-form'
import {requireMember} from '@/lib/site'
export const metadata={title:'Member Settings | Fitness Pro'}
export default async function MemberSettings(){const {member,user}=await requireMember();return <><div className="portalHeading"><div><span className="eyebrow">Member settings</span><h1>Settings</h1><p>Manage appearance, profile details and your current session.</p></div></div><MemberSettingsForm name={member.full_name} phone={member.phone} email={member.email||user.email||''}/></>}

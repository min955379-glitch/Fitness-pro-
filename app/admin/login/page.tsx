import {AuthPage} from '@/components/auth-page'
import {LoginForm} from '@/components/auth-forms'
export const metadata={title:'Admin Login | Fitness Pro'}
export default function AdminLogin(){return <AuthPage eyebrow="Private management portal" title="Fitness Pro admin" copy="Authorized team members can manage members, attendance, pricing and website content."><LoginForm adminOnly/></AuthPage>}

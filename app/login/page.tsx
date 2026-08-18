import Link from 'next/link'
import {AuthPage} from '@/components/auth-page'
import {LoginForm} from '@/components/auth-forms'
export const metadata={title:'Member Login | Fitness Pro'}
export default async function Login({searchParams}:{searchParams:Promise<{plan?:string;registered?:string}>}){const query=await searchParams;return <AuthPage eyebrow="Member access" title="Welcome back" copy="Log in to view your membership, attendance and payment requests." footer={<p>New to Fitness Pro? <Link href="/register">Create an account</Link></p>}>{query.registered&&<div className="notice notice-success">Registration created. Open the confirmation link sent to your email before logging in. If it is missing, use “Resend confirmation email” below.</div>}<LoginForm nextPlan={query.plan}/></AuthPage>}

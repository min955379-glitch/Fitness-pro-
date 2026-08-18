import Link from 'next/link'
import {AuthPage} from '@/components/auth-page'
import {RegisterForm} from '@/components/auth-forms'
import {getPublicData} from '@/lib/site'
export const metadata={title:'Join Fitness Pro | Member Registration'}
export default async function Register({searchParams}:{searchParams:Promise<{plan?:string;profile?:string}>}){const [{plans},query]=await Promise.all([getPublicData(),searchParams]);return <AuthPage eyebrow="Membership registration" title="Start your Fitness Pro journey" copy="Create your secure member account. Our team will review your registration before attendance access is enabled." footer={<p>Already registered? <Link href="/login">Log in</Link></p>}>{query.profile&&<div className="notice notice-warning">Your account is signed in, but no member profile exists yet. Please contact the gym team.</div>}<RegisterForm plans={plans} selectedPlan={query.plan}/></AuthPage>}

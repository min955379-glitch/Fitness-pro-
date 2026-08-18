import Link from 'next/link'
import {AuthPage} from '@/components/auth-page'
import {ForgotPasswordForm} from '@/components/auth-forms'
export const metadata={title:'Reset Password | Fitness Pro'}
export default function ForgotPassword(){return <AuthPage eyebrow="Account recovery" title="Reset your password" copy="Enter the email used for your Fitness Pro account and we will send a secure reset link." footer={<p>Remembered it? <Link href="/login">Back to login</Link></p>}><ForgotPasswordForm/></AuthPage>}

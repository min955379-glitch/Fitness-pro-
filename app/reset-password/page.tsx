import {AuthPage} from '@/components/auth-page'
import {ResetPasswordForm} from '@/components/auth-forms'
export const metadata={title:'Choose New Password | Fitness Pro'}
export default function ResetPassword(){return <AuthPage eyebrow="Secure your account" title="Choose a new password" copy="Use at least eight characters and avoid reusing a password from another service."><ResetPasswordForm/></AuthPage>}

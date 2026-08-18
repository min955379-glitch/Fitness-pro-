import {createServerClient} from '@supabase/ssr'
import {NextResponse,type NextRequest} from 'next/server'
export async function proxy(request:NextRequest){
  let response=NextResponse.next({request:{headers:request.headers}})
  const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>request.cookies.getAll(),setAll:(items)=>{items.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});items.forEach(({name,value,options})=>response.cookies.set(name,value,options))}}})
  const {data:{user}}=await supabase.auth.getUser()
  const path=request.nextUrl.pathname
  const adminProtected=path.startsWith('/admin')&&path!=='/admin/login'
  const memberProtected=path.startsWith('/member')||path==='/payment'
  if(!user&&(adminProtected||memberProtected)){
    const target=adminProtected?'/admin/login':'/login'
    const url=new URL(target,request.url)
    if(memberProtected)url.searchParams.set('next',path)
    return NextResponse.redirect(url)
  }
  if(user&&(path==='/login'||path==='/register'||path==='/admin/login')){
    // Authorization is resolved by the destination page; keep auth pages available for explicit account switching.
  }
  return response
}
export const config={matcher:['/admin/:path*','/member/:path*','/payment']}

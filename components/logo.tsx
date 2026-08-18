import Link from 'next/link'
export function Logo({compact=false}:{compact?:boolean}){
  return <Link className="brand" href="/" aria-label="Fitness Pro home">
    <span className="brandmark" aria-hidden="true">FP</span>
    {!compact&&<span className="brandword">FITNESS <b>PRO</b></span>}
  </Link>
}

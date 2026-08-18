import {GalleryBrowser} from '@/components/gallery-browser'
import {SiteShell} from '@/components/site-shell'
import {PageHero} from '@/components/ui'
import {getPublicData} from '@/lib/site'
export const metadata={title:'Gallery | Fitness Pro Abbottabad',description:'Explore the Fitness Pro training floor, strength equipment and cardio space.'}
export default async function Gallery(){const {settings,gallery}=await getPublicData();return <SiteShell settings={settings}><main><PageHero eyebrow="Inside the gym" title="A space built for focused work." copy="Browse our training areas and equipment. Filter the gallery to find what matters to your routine."/><section className="section"><div className="container"><GalleryBrowser items={gallery}/></div></section></main></SiteShell>}

'use client'
import Image from 'next/image'
import {useMemo,useState} from 'react'
import type {GalleryItem} from '@/lib/types'
export function GalleryBrowser({items}:{items:GalleryItem[]}){const [category,setCategory]=useState('All');const categories=useMemo(()=>['All',...Array.from(new Set(items.map(i=>i.category)))],[items]);const shown=category==='All'?items:items.filter(i=>i.category===category);return <><div className="filterTabs" role="tablist" aria-label="Gallery categories">{categories.map(c=><button key={c} type="button" className={c===category?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="galleryGrid">{shown.map(item=><figure key={item.id}><Image src={item.image_url} alt={item.caption||`Fitness Pro ${item.category}`} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"/><figcaption><span>{item.category}</span>{item.caption}</figcaption></figure>)}</div></>}

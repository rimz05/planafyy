"use client"
import { Button } from '@/components/ui/button'
import { SheetContent, Sheet } from '@/components/ui/sheet'
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Sidebar from './sidebar'

const MobileSidebar = () => {
    const pathname = usePathname(); 
    const [isMounted, setIsMounted] = useState(false)

    const onOpen = useMobileSidebar((state) =>state.onOpen)
    const onClose = useMobileSidebar((state) =>state.onClose)
    const isOpen = useMobileSidebar((state) =>state.isOpen)

    useEffect(()=>{
        setIsMounted(true);
    }, [])

    useEffect(()=>{
      onClose();
    }, [pathname, onClose])

    if(!isMounted){
        return null;
    }
  return (
    <>
    <Button onClick={onOpen}
    className='block md:hidden mr-2'
    variant="ghost"
    size="sm">
      <Menu className='h-4 w-4'/>
    </Button>
    <Sheet open= {isOpen} onOpenChange={onClose}>
      <SheetContent 
      side='left'
      className='p-2 pt-10'>
        <Sidebar
        storageKey='t-sidebar-mobile-state'/>
      </SheetContent>
    </Sheet>
    </>
  )
}

export default MobileSidebar

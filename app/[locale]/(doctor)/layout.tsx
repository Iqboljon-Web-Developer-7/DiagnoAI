import { Header } from '@/components/layout/Header/header'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <Header />
            <section className='mt-4'>
                {children}
            </section>
        </main>
    )
}

export default layout
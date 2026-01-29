import React, { Children } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({children}) => {
    return (
        <>
            <Navbar />
            <main className='min-h-screen'>{children}</main>
            <Footer />
        </>
    )
}

export default Layout
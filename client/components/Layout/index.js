import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Head from 'next/head'

const Layout = ({ children, title }) => {

    const pageTitle = title || "Social Media App";

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{pageTitle}</title>
            </Head>
            <Header />
            <main className="container" style={{ minHeight: "70vh",}}>{children}</main>
            <Footer />
        </>
    );
};


export default Layout;

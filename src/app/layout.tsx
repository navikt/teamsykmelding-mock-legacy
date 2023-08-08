import '../styles/globals.css'
import '@reach/combobox/styles.css'

import React, { PropsWithChildren, ReactElement } from 'react'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function RootLayout({ children }: PropsWithChildren): ReactElement {
    return (
        <html lang="no">
            <body>
                <Header />
                <div className="flex">
                    <div className="max-w-[360px] shrink-0">
                        <Sidebar />
                    </div>
                    <div className="p-4 max-w-4xl">{children}</div>
                </div>
            </body>
        </html>
    )
}

import '../styles/globals.css'
import '@reach/combobox/styles.css'

import { ReactElement } from 'react'
import type { AppProps } from 'next/app'
import { InternalHeader } from '@navikt/ds-react'

import Sidebar from '../components/Sidebar'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
    return (
        <>
            <InternalHeader>
                <InternalHeader.Title as="h1">La det mocke la det rock and roll</InternalHeader.Title>
            </InternalHeader>
            <div className="flex">
                <Sidebar />
                <div>
                    <Component {...pageProps} />
                </div>
            </div>
        </>
    )
}

export default MyApp

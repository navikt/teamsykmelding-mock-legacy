import '../styles/globals.css'

import { ReactElement } from 'react'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import { StethoscopeIcon, PrinterSmallIcon, BandageIcon, Buldings2Icon } from '@navikt/aksel-icons'
import { InternalHeader } from '@navikt/ds-react'

import styles from '../styles/App.module.css'

function MyApp({ Component, pageProps }: AppProps): ReactElement {
    return (
        <>
            <InternalHeader>
                <InternalHeader.Title as="h1">La det mocke la det rock and roll</InternalHeader.Title>
            </InternalHeader>
            <div className={styles.innholdsWrapper}>
                <div>
                    <ul className={styles.sideMeny}>
                        <Buldings2Icon /> Nærmeste leder
                        <li>
                            <Link href="/narmesteleder/opprett">Registrer nærmeste leder</Link>
                        </li>
                        <li>
                            <Link href="/narmesteleder/slett">Deaktiver nærmeste leder</Link>
                        </li>
                        <br />
                        <StethoscopeIcon /> Legeerklæring
                        <li>
                            <Link href="/legeerklaering/opprett">Opprett legeerklæring</Link>
                        </li>
                        <br />
                        <BandageIcon /> Sykmelding
                        <li>
                            <Link href="/sykmelding/opprett">Opprett sykmelding</Link>
                        </li>
                        <li>
                            <Link href="/sykmelding/slett">Slett alle sykmeldinger</Link>
                        </li>
                        <br />
                        <PrinterSmallIcon /> Papirsykmelding
                        <li>
                            <Link href="/papirsykmelding/opprett">Opprett papirsykmelding</Link>
                        </li>
                        <li>
                            <Link href="/papirsykmelding-utland/opprett">Opprett utenlandsk papirsykmelding</Link>
                        </li>
                        <li>
                            <Link href="/papirsykmelding-utland-rina/opprett">Opprett utenlandsk sykmelding rina</Link>
                        </li>
                        <li>
                            <Link href="/papirsykmelding-utland-nav-no/opprett">
                                Opprett utenlandsk sykmelding nav.no
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className={styles.innhold}>
                    <Component {...pageProps} />
                </div>
            </div>
        </>
    )
}

export default MyApp

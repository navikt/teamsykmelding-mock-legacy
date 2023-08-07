import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { Print } from '@navikt/ds-icons';
import { Bandage } from '@navikt/ds-icons';
import { Employer } from '@navikt/ds-icons';
import { Stethoscope } from '@navikt/ds-icons';
import { Header } from '@navikt/ds-react-internal';

import styles from '../styles/App.module.css';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <Header>
                <Header.Title as="h1">La det mocke la det rock and roll</Header.Title>
            </Header>
            <div className={styles.innholdsWrapper}>
                <div>
                    <ul className={styles.sideMeny}>
                        <Employer /> Nærmeste leder
                        <li>
                            <Link href="/narmesteleder/opprett">Registrer nærmeste leder</Link>
                        </li>
                        <li>
                            <Link href="/narmesteleder/slett">Deaktiver nærmeste leder</Link>
                        </li>
                        <br />
                        <Stethoscope /> Legeerklæring
                        <li>
                            <Link href="/legeerklaering/opprett">Opprett legeerklæring</Link>
                        </li>
                        <br />
                        <Bandage /> Sykmelding
                        <li>
                            <Link href="/sykmelding/opprett">Opprett sykmelding</Link>
                        </li>
                        <li>
                            <Link href="/sykmelding/slett">Slett alle sykmeldinger</Link>
                        </li>
                        <br />
                        <Print /> Papirsykmelding
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
    );
}

export default MyApp;

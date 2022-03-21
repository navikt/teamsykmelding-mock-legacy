import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { PageHeader } from '@navikt/ds-react';

import styles from '../styles/App.module.css';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <PageHeader description="La det mocke la det rock and roll">Team Sykmelding Mock</PageHeader>
            <div className={styles.innholdsWrapper}>
                <ul className={styles.sideMeny}>
                    <li>
                        <Link href="/">Hjem</Link>
                    </li>
                    <li>
                        <Link href="/narmesteleder/opprett">Registrer nærmeste leder</Link>
                    </li>
                    <li>
                        <Link href="/narmesteleder/slett">Deaktiver nærmeste leder</Link>
                    </li>
                    <li>
                        <Link href="/legeerklaering/opprett">Opprett legeerklæring</Link>
                    </li>
                </ul>
                <div className={styles.innhold}>
                    <Component {...pageProps} />
                </div>
            </div>
        </>
    );
}

export default MyApp;

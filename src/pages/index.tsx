import type { NextPage } from 'next';
import Head from 'next/head';
import { PageHeader } from '@navikt/ds-react';
import { Print } from '@navikt/ds-icons';
import { Bandage } from '@navikt/ds-icons';
import { Employer } from '@navikt/ds-icons';
import { Stethoscope } from '@navikt/ds-icons';
import Link from 'next/link';
import { Link as DsLink } from '@navikt/ds-react';

import styles from '../styles/App.module.css';

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Team Sykmelding Mock</title>
                <meta name="description" content="Mock" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageHeader description="La det mocke la det rock and roll">Team Sykmelding Mock</PageHeader>
            <div className={styles.innholdsWrapper}>
                <div>
                    <h1>
                        <Employer /> Nærmeste leder
                    </h1>
                    <ul className={styles.sideMeny}>
                        <li>
                            <Link href="/narmesteleder/opprett" passHref>
                                <DsLink>Registrer nærmeste leder</DsLink>
                            </Link>
                        </li>
                        <li>
                            <Link href="/narmesteleder/slett" passHref>
                                <DsLink>Deaktiver nærmeste leder</DsLink>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h1>
                        <Stethoscope /> Legeerklæring
                    </h1>
                    <ul className={styles.sideMeny}>
                        <li>
                            <Link href="/legeerklaering/opprett" passHref>
                                <DsLink>Opprett legeerklæring </DsLink>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h1>
                        <Bandage /> Sykmelding
                    </h1>
                    <ul className={styles.sideMeny}>
                        <li>
                            <Link href="/sykmelding/opprett" passHref>
                                <DsLink>Opprett sykmelding</DsLink>
                            </Link>
                        </li>
                        <li>
                            <Link href="/sykmelding/slett" passHref>
                                <DsLink>Slett alle sykmeldinger</DsLink>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h1>
                        <Print /> Papirsykmelding
                    </h1>
                    <ul className={styles.sideMeny}>
                        <li>
                            <Link href="/papirsykmelding/opprett" passHref>
                                <DsLink>Opprett papirsykmelding </DsLink>
                            </Link>
                        </li>
                        <li>
                            <Link href="/papirsykmelding-utland/opprett" passHref>
                                <DsLink>Opprett utenlandsk papirsykmelding</DsLink>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;

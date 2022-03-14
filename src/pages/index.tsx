import { BodyShort, Cell, ContentContainer, Grid, Link } from '@navikt/ds-react';
import Head from 'next/head';
import { useEffect } from 'react';

import { logger } from '../utils/logger';
import styles from '../styles/Home.module.css';

function Home(): JSX.Element {
    useEffect(() => {
        logger.info('Dette er logging fra frontend');
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Team Sykmelding Mock</title>
                <meta name="description" content="Mock" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ContentContainer>
                <section>
                    <Grid>
                        <Cell xs={12}>
                            <BodyShort>Kommer snart</BodyShort>
                            <Link href="./narmesteleder/opprett">Registrer nærmeste leder</Link>
                        </Cell>
                    </Grid>
                </section>
            </ContentContainer>
        </div>
    );
}

export default Home;

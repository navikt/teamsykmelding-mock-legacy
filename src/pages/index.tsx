import { ReactElement, useEffect } from 'react'
import { BodyShort, Cell, ContentContainer, Grid } from '@navikt/ds-react'
import Head from 'next/head'
import { logger } from '@navikt/next-logger'

import styles from '../styles/Home.module.css'

function Home(): ReactElement {
    useEffect(() => {
        logger.info('Dette er logging fra frontend')
    }, [])

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
                        <Cell xs={5}>
                            <BodyShort>Velkommen til Team Sykmelding sin mock!</BodyShort>
                            <BodyShort>Velg hva du vil gjøre i side menyen!</BodyShort>
                        </Cell>
                    </Grid>
                </section>
            </ContentContainer>
        </div>
    )
}

export default Home

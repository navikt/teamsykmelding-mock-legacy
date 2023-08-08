import { ReactElement } from 'react'
import { ContentContainer } from '@navikt/ds-react'
import Head from 'next/head'

import OpprettSykmelding from '../../components/sykmelding/OpprettSykmelding'

function OpprettSM(): ReactElement {
    return (
        <>
            <Head>
                <title>Opprett sykmelding</title>
            </Head>

            <ContentContainer>
                <OpprettSykmelding />
            </ContentContainer>
        </>
    )
}

export default OpprettSM

import { ReactElement } from 'react'
import { ContentContainer } from '@navikt/ds-react'
import Head from 'next/head'

import OpprettUtenlandskPapirsykmelding from '../../components/papirsykmelding-utland/OpprettUtenlandskPapirsykmelding'

function OpprettUtenlandskPapirSM(): ReactElement {
    return (
        <>
            <Head>
                <title>Opprett utenlandsk papirsykmelding</title>
            </Head>

            <ContentContainer>
                <OpprettUtenlandskPapirsykmelding />
            </ContentContainer>
        </>
    )
}

export default OpprettUtenlandskPapirSM

import { ReactElement } from 'react'
import { ContentContainer } from '@navikt/ds-react'
import Head from 'next/head'

import OpprettPapirsykmelding from '../../components/papirsykmelding/OpprettPapirsykmelding'

function OpprettPapirSM(): ReactElement {
    return (
        <>
            <Head>
                <title>Opprett papirsykmelding</title>
            </Head>

            <ContentContainer>
                <OpprettPapirsykmelding />
            </ContentContainer>
        </>
    )
}

export default OpprettPapirSM

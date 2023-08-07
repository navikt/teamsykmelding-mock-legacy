import { ReactElement } from 'react'
import { ContentContainer } from '@navikt/ds-react'
import Head from 'next/head'

import OpprettUtenlandskPapirsykmeldingRina from '../../components/papirsykmelding-utland-rina/OpprettUtenlandskPapirsykmeldingRina'

export default function OpprettUtenlandskPapirSMRina(): ReactElement {
    return (
        <>
            <Head>
                <title>Opprett utenlandsk papirsykmelding RINA</title>
            </Head>

            <ContentContainer>
                <OpprettUtenlandskPapirsykmeldingRina />
            </ContentContainer>
        </>
    )
}

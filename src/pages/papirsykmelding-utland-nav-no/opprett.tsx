import { ReactElement } from 'react'
import { ContentContainer } from '@navikt/ds-react'
import Head from 'next/head'

import OpprettUtenlandskPapirsykmeldingNavNo from '../../components/papirsykmelding-utland-nav-no/OpprettUtenlandskPapirsykmeldingNavNo'

export default function OpprettUtenlandskPapirSMNavNo(): ReactElement {
    return (
        <>
            <Head>
                <title>Opprett utenlandsk papirsykmelding Nav.no</title>
            </Head>

            <ContentContainer>
                <OpprettUtenlandskPapirsykmeldingNavNo />
            </ContentContainer>
        </>
    )
}

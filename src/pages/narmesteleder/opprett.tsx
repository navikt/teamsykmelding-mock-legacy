import { ReactElement } from 'react'
import { ContentContainer } from '@navikt/ds-react'
import Head from 'next/head'

import OpprettNarmesteleder from '../../components/narmesteleder/OpprettNarmesteleder'

function OpprettNL(): ReactElement {
    return (
        <>
            <Head>
                <title>Opprett nærmeste leder</title>
            </Head>

            <ContentContainer>
                <OpprettNarmesteleder />
            </ContentContainer>
        </>
    )
}

export default OpprettNL

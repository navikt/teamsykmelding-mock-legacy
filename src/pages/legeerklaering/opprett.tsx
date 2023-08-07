import { ReactElement } from 'react'
import { ContentContainer } from '@navikt/ds-react'
import Head from 'next/head'

import OpprettLegeerklaering from '../../components/legeerklaering/OpprettLegeerklaering'

function OpprettLE(): ReactElement {
    return (
        <>
            <Head>
                <title>Opprett legeerklæring</title>
            </Head>

            <ContentContainer>
                <OpprettLegeerklaering />
            </ContentContainer>
        </>
    )
}

export default OpprettLE

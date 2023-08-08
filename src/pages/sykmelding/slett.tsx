import { ReactElement } from 'react'
import { ContentContainer } from '@navikt/ds-react'
import Head from 'next/head'

import SlettSykmelding from '../../components/sykmelding/SlettSykmelding'

function SlettSM(): ReactElement {
    return (
        <>
            <Head>
                <title>Slett alle sykmeldinger</title>
            </Head>

            <ContentContainer>
                <SlettSykmelding />
            </ContentContainer>
        </>
    )
}

export default SlettSM

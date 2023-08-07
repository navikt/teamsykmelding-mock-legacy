import { ReactElement } from 'react'
import { ContentContainer } from '@navikt/ds-react'
import Head from 'next/head'

import SlettNarmesteleder from '../../components/narmesteleder/SlettNarmesteleder'

function SlettNL(): ReactElement {
    return (
        <>
            <Head>
                <title>Deaktiver nærmeste leder</title>
            </Head>

            <ContentContainer>
                <SlettNarmesteleder />
            </ContentContainer>
        </>
    )
}

export default SlettNL

import { ReactElement } from 'react'
import { Metadata } from 'next'

import { BodyShort } from '../components/aksel/server'

export const metadata: Metadata = {
    title: 'Team Sykmelding Mock',
}

function Page(): ReactElement {
    return (
        <div>
            <BodyShort spacing>Velkommen til Team Sykmelding sin mock!</BodyShort>
            <BodyShort>Velg hva du vil gjøre i side menyen!</BodyShort>
        </div>
    )
}

export default Page

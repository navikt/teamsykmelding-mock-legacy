import { ContentContainer } from '@navikt/ds-react';
import Head from 'next/head';

import OpprettUtenlandskPapirsykmeldingRina from '../../components/papirsykmelding-utland-rina/OpprettUtenlandskPapirsykmeldingRina';

export default function OpprettUtenlandskPapirSMRina(): JSX.Element {
    return (
        <>
            <Head>
                <title>Opprett utenlandsk papirsykmelding RINA</title>
            </Head>

            <ContentContainer>
                <OpprettUtenlandskPapirsykmeldingRina />
            </ContentContainer>
        </>
    );
}

import { ContentContainer } from '@navikt/ds-react';
import Head from 'next/head';

import OpprettUtenlandskPapirsykmeldingNavNo from '../../components/papirsykmelding-utland-nav-no/OpprettUtenlandskPapirsykmeldingNavNo';

export default function OpprettUtenlandskPapirSMNavNo(): JSX.Element {
    return (
        <>
            <Head>
                <title>Opprett utenlandsk papirsykmelding Nav.no</title>
            </Head>

            <ContentContainer>
                <OpprettUtenlandskPapirsykmeldingNavNo />
            </ContentContainer>
        </>
    );
}

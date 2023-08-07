import { ContentContainer } from '@navikt/ds-react';
import Head from 'next/head';

import OpprettPapirsykmelding from '../../components/papirsykmelding/OpprettPapirsykmelding';

function OpprettPapirSM(): JSX.Element {
    return (
        <>
            <Head>
                <title>Opprett papirsykmelding</title>
            </Head>

            <ContentContainer>
                <OpprettPapirsykmelding />
            </ContentContainer>
        </>
    );
}

export default OpprettPapirSM;

import { ContentContainer } from '@navikt/ds-react';
import Head from 'next/head';

import SlettSykmelding from '../../components/sykmelding/SlettSykmelding';

function SlettSM(): JSX.Element {
    return (
        <>
            <Head>
                <title>Slett sykmelding</title>
            </Head>

            <ContentContainer>
                <SlettSykmelding />
            </ContentContainer>
        </>
    );
}

export default SlettSM;

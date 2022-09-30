import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Modal } from '@navikt/ds-react';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    useEffect(() => {
        Modal.setAppElement?.('#__next');
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;

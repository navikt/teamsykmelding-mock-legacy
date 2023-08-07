import { Alert, Button, Checkbox, Heading, TextField } from '@navikt/ds-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { format } from 'date-fns';

import AktivFraOgMed from './AktivFraOgMed';

export interface NarmestelederFormValues {
    ansattFnr: string;
    lederFnr: string;
    orgnummer: string;
    mobil: string;
    epost: string;
    forskutterer: boolean;
    aktivFom: string;
}

function OpprettNarmesteleder(): JSX.Element {
    const dagensDato = format(new Date(), 'yyyy-MM-dd');
    const form = useForm<NarmestelederFormValues>({
        defaultValues: {
            aktivFom: dagensDato,
        },
    });
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const OPPRETT_NL_URL = `/api/proxy/narmesteleder/opprett`;

    const postData = async (data: NarmestelederFormValues): Promise<void> => {
        setError(null);
        setResult(null);
        const response = await fetch(OPPRETT_NL_URL, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.ok) {
            setResult((await response.json()).message);
        } else {
            setError((await response.json()).message);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(postData)}>
                <Heading size="medium" level="2">
                    Registrer nærmeste leder
                </Heading>
                <p />
                <TextField
                    {...form.register('ansattFnr', { required: true })}
                    label="Fødselsnummer"
                    error={form.formState.errors.ansattFnr && 'Fødselsnummer for den sykmeldte mangler'}
                />
                <TextField
                    {...form.register('lederFnr', { required: true })}
                    label="Fødselsnummer til ny nærmeste leder"
                    error={form.formState.errors.lederFnr && 'Fødselsnummer for nærmeste leder mangler'}
                />
                <TextField
                    {...form.register('orgnummer', { required: true })}
                    label="Organisasjonsnummer"
                    error={form.formState.errors.orgnummer && 'Organisasjonsnummer mangler'}
                />
                <TextField
                    {...form.register('mobil', { required: true })}
                    label="Telefonnummer til ny nærmeste leder"
                    error={form.formState.errors.mobil && 'Telefonnummer for nærmeste leder mangler'}
                />
                <TextField
                    {...form.register('epost', { required: true })}
                    label="E-post til ny nærmeste leder"
                    error={form.formState.errors.epost && 'E-post for nærmeste leder mangler'}
                />
                <Checkbox {...form.register('forskutterer')}>Arbeidsgiver forskutterer</Checkbox>
                <AktivFraOgMed />
                <p />
                <Button type="submit">Registrer</Button>
                <p />
                {error && <Alert variant="error">{error}</Alert>}
                {result && <Alert variant="success">{result}</Alert>}
            </form>
        </FormProvider>
    );
}

export default OpprettNarmesteleder;

import { Alert, Button, Heading, TextField } from '@navikt/ds-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';

interface FormValues {
    fnr: string;
    orgnummer: string;
}

function SlettNarmesteleder(): JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const SLETT_NL_URL = `/api/proxy/narmesteleder/`;

    const postData = async (data: FormValues): Promise<void> => {
        const response = await fetch(`${SLETT_NL_URL}${data.orgnummer}`, {
            method: 'DELETE',
            headers: {
                'Sykmeldt-Fnr': data.fnr,
            },
        });

        if (response.ok) {
            setResult((await response.json()).message);
        } else {
            setError((await response.json()).message);
        }
    };

    return (
        <form onSubmit={handleSubmit(postData)}>
            <Heading size="medium" level="2">
                Deaktiver nærmeste leder
            </Heading>
            <p />
            <TextField
                {...register('fnr', { required: true })}
                label="Sykmeldtes fødselsnummer"
                error={errors.fnr && 'Fødselsnummer for den sykmeldte mangler'}
            />
            <TextField
                {...register('orgnummer', { required: true })}
                label="Organisasjonsnummer"
                error={errors.orgnummer && 'Organisasjonsnummer mangler'}
            />
            <p />
            <Button type="submit">Registrer</Button>
            <p />
            {error && <Alert variant="error">{error}</Alert>}
            {result && <Alert variant="success">{result}</Alert>}
        </form>
    );
}

export default SlettNarmesteleder;

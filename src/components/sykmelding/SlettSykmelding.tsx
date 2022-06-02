import { Alert, Button, Heading, TextField } from '@navikt/ds-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormValues {
    fnr: string;
}

function SlettSykmelding(): JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const SLETT_SYKMELDING_URL = `/api/proxy/sykmeldinger`;

    const postData = async (data: FormValues): Promise<void> => {
        const response = await fetch(`${SLETT_SYKMELDING_URL}`, {
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
                Slett alle sykmeldinger
            </Heading>
            <p />
            <TextField
                {...register('fnr', { required: true })}
                label="Sykmeldtes fødselsnummer"
                error={errors.fnr && 'Fødselsnummer for den sykmeldte mangler'}
            />
            <p />
            <Button type="submit">Slett</Button>
            <p />
            {error && <Alert variant="error">{error}</Alert>}
            {result && <Alert variant="success">{result}</Alert>}
        </form>
    );
}

export default SlettSykmelding;

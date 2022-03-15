import { Alert, Button, Checkbox, Heading, TextField } from '@navikt/ds-react';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

interface FormValues {
    ansattFnr: string;
    lederFnr: string;
    orgnummer: string;
    mobil: string;
    epost: string;
    forskutterer: boolean;
    aktivFom: Date;
}

function OpprettNarmesteleder(): JSX.Element {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const OPPRETT_NL_URL = `/api/proxy/narmesteleder/opprett`;

    const postData = async (data: FormValues): Promise<void> => {
        const aktivFom = data.aktivFom ?? new Date();
        const mappedData = {
            ...data,
            aktivFom: format(aktivFom, 'yyyy-MM-dd'),
        };

        const response = await fetch(OPPRETT_NL_URL, {
            method: 'POST',
            body: JSON.stringify(mappedData),
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
                Registrer nærmeste leder
            </Heading>
            <p />
            <TextField
                {...register('ansattFnr', { required: true })}
                label="Fødselsnummer"
                error={errors.ansattFnr && 'Fødselsnummer for den sykmeldte mangler'}
            />
            <TextField
                {...register('lederFnr', { required: true })}
                label="Fødselsnummer til ny nærmeste leder"
                error={errors.lederFnr && 'Fødselsnummer for nærmeste leder mangler'}
            />
            <TextField
                {...register('orgnummer', { required: true })}
                label="Organisasjonsnummer"
                error={errors.orgnummer && 'Organisasjonsnummer mangler'}
            />
            <TextField
                {...register('mobil', { required: true })}
                label="Telefonnummer til ny nærmeste leder"
                error={errors.mobil && 'Telefonnummer for nærmeste leder mangler'}
            />
            <TextField
                {...register('epost', { required: true })}
                label="E-post til ny nærmeste leder"
                error={errors.epost && 'E-post for nærmeste leder mangler'}
            />
            <Checkbox {...register('forskutterer')}>Arbeidsgiver forskutterer</Checkbox>
            <p>
                <b>Aktiv fra og med</b>
            </p>
            <Controller
                control={control}
                name="aktivFom"
                render={({ field }) => (
                    <DatePicker onChange={(date) => field.onChange(date)} selected={field.value ?? new Date()} />
                )}
            />
            <p />
            <Button type="submit">Registrer</Button>
            <p />
            {error && <Alert variant="error">{error}</Alert>}
            {result && <Alert variant="success">{result}</Alert>}
        </form>
    );
}

export default OpprettNarmesteleder;

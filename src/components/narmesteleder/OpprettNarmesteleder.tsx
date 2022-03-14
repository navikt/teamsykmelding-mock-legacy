import { Alert, Checkbox, Heading, TextField } from '@navikt/ds-react';
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
    const { register, control, handleSubmit } = useForm<FormValues>();
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const OPPRETT_NL_URL = `/api/proxy/narmesteleder/opprett`;

    const postData = async (data: FormValues): Promise<void> => {
        const mappedData = {
            ...data,
            aktivFom: format(data.aktivFom, 'yyyy-MM-dd'),
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
            <TextField {...register('ansattFnr')} label="Fødselsnummer" />
            <TextField {...register('lederFnr')} label="Fødselsnummer til ny nærmeste leder" />
            <TextField {...register('orgnummer')} label="Organisasjonsnummer" />
            <TextField {...register('mobil')} label="Telefonnummer til ny nærmeste leder" />
            <TextField {...register('epost')} label="E-post til ny nærmeste leder" />
            <Checkbox {...register('forskutterer')}>Arbeidsgiver forskutterer</Checkbox>
            <p>Aktiv fra og med</p>
            <Controller
                control={control}
                name="aktivFom"
                render={({ field }) => (
                    <DatePicker
                        placeholderText="aktivFom"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                    />
                )}
            />
            <input type="submit" />
            {error && <Alert variant="error">{error}</Alert>}
            {result && <Alert variant="success">{result}</Alert>}
        </form>
    );
}

export default OpprettNarmesteleder;

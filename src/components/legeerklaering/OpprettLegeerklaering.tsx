/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Button, Checkbox, Heading, TextField } from '@navikt/ds-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import DiagnosePicker, { Diagnose } from '../formComponents/DiagnosePicker/DiagnosePicker';

interface FormValues {
    fnr: string;
    fnrLege: string;
    statusPresens: string;
    vedlegg: boolean;
    vedleggMedVirus: boolean;
    hoveddiagnose: Diagnose;
}

type OpprettLegeerklaeringApiBody = Omit<FormValues, 'hoveddiagnose'> & {
    diagnosekodesystem: 'icd10' | 'icpc2';
    diagnosekode: string;
};

function OpprettLegeerklaering(): JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormValues>({
        defaultValues: {
            hoveddiagnose: { system: 'icd10', code: 'H100', text: 'Mukopurulent konjunktivitt' },
        },
    });
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const OPPRETT_LEGEERKLAERING_URL = `/api/proxy/legeerklaering/opprett`;

    const postData = async (data: FormValues): Promise<void> => {
        const postData: OpprettLegeerklaeringApiBody = {
            fnr: data.fnr,
            fnrLege: data.fnrLege,
            statusPresens: data.statusPresens,
            vedlegg: data.vedlegg,
            vedleggMedVirus: data.vedleggMedVirus,
            diagnosekodesystem: data.hoveddiagnose.system,
            diagnosekode: data.hoveddiagnose.code,
        };

        const response = await fetch(OPPRETT_LEGEERKLAERING_URL, {
            method: 'POST',
            body: JSON.stringify(postData),
        });

        if (response.ok) {
            setResult((await response.json()).message);
        } else {
            setError((await response.json()).message);
        }
    };

    return (
        <form onSubmit={handleSubmit(postData)}>
            <Heading size="medium" level="2" spacing>
                Opprett legeerklæring
            </Heading>
            <p />
            <TextField
                {...register('fnr', { required: true })}
                label="Fødselsnummer"
                error={errors.fnr && 'Fødselsnummer for pasienten mangler'}
            />
            <TextField
                {...register('fnrLege', { required: true })}
                label="Fødselsnummer til lege"
                defaultValue={'01117302624'}
                error={errors.fnrLege && 'Fødselsnummer til lege mangler'}
            />
            <p>
                <b>HouvedDiagnose</b>
            </p>
            <DiagnosePicker control={control as any} name={'hoveddiagnose'} diagnoseType={'hoveddiagnose'} />

            <TextField {...register('statusPresens')} label="Status presens" />
            <Checkbox {...register('vedlegg')}>Vedlegg</Checkbox>
            <Checkbox {...register('vedleggMedVirus')}>Vedlegg med virus</Checkbox>
            <p />
            <Button type="submit">Opprett</Button>
            <p />
            {error && <Alert variant="error">{error}</Alert>}
            {result && <Alert variant="success">{result}</Alert>}
        </form>
    );
}

export default OpprettLegeerklaering;

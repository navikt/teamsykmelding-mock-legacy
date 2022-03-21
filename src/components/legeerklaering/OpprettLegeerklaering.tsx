import { Alert, Button, Checkbox, Heading, Select, TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Diagnosekode, Diagnosekoder, DiagnosekodeSystem } from '../../types/diagnosekoder/Diagnosekoder';
import { getDiagnosekoder } from '../../utils/dataUtils';
import { logger } from '../../utils/logger';

interface FormValues {
    fnr: string;
    fnrLege: string;
    diagnosekodesystem: 'icd10' | 'icpc2';
    diagnosekode: string;
    statusPresens: string;
    vedlegg: boolean;
}

function OpprettLegeerklaering(): JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormValues>();
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const OPPRETT_LEGEERKLAERING_URL = `/api/proxy/legeerklaering/opprett`;
    const [diagnosekoder, setDiagnosekoder] = useState<Diagnosekoder | undefined>(undefined);
    const diagnosekodesystem = watch('diagnosekodesystem');

    useEffect(() => {
        (async () => {
            try {
                const _diagnosekoder = await getDiagnosekoder();
                setDiagnosekoder(_diagnosekoder);
            } catch (error: unknown) {
                logger.error(error);
            }
        })();
    }, []);

    const icd10Koder: Diagnosekode[] = diagnosekoder?.[DiagnosekodeSystem.ICD10] ?? [];
    const icpc2Koder: Diagnosekode[] = diagnosekoder?.[DiagnosekodeSystem.ICPC2] ?? [];

    const postData = async (data: FormValues): Promise<void> => {
        const response = await fetch(OPPRETT_LEGEERKLAERING_URL, {
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
        <form onSubmit={handleSubmit(postData)}>
            <Heading size="medium" level="2">
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
            <Select {...register('diagnosekodesystem', { required: true })} label="Diagnosekodesystem">
                <option value="icd10">ICD10</option>
                <option value="icpc2">ICPC2</option>
            </Select>
            {diagnosekodesystem === 'icd10' && (
                <Select
                    {...register('diagnosekode', { required: true })}
                    label="Diagnosekode"
                    description="Skriv tullekode for å få en kode som vil bli avslått i systemet!"
                >
                    {icd10Koder.map((it) => (
                        <option key={it.code} value={it.code}>
                            {it.code + ' - ' + it.text}
                        </option>
                    ))}
                    <option value="tullekode">Tullekode</option>
                </Select>
            )}
            {diagnosekodesystem === 'icpc2' && (
                <Select
                    {...register('diagnosekode', { required: true })}
                    label="Diagnosekode"
                    description="Skriv tullekode for å få en kode som vil bli avslått i systemet!"
                >
                    {icpc2Koder.map((it) => (
                        <option key={it.code} value={it.code}>
                            {it.code + ' - ' + it.text}
                        </option>
                    ))}
                    <option value="tullekode">Tullekode</option>
                </Select>
            )}
            <TextField {...register('statusPresens')} label="Status presens" />
            <Checkbox {...register('vedlegg')}>Vedlegg</Checkbox>
            <p />
            <Button type="submit">Opprett</Button>
            <p />
            {error && <Alert variant="error">{error}</Alert>}
            {result && <Alert variant="success">{result}</Alert>}
        </form>
    );
}

export default OpprettLegeerklaering;

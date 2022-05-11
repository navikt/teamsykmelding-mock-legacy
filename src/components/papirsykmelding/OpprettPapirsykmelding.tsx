import { Alert, Button, Checkbox, Heading, Select, TextField } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { format, sub } from 'date-fns';
import { Datepicker } from '@navikt/ds-datepicker';

import { Diagnosekode, Diagnosekoder, DiagnosekodeSystem } from '../../types/diagnosekoder/Diagnosekoder';
import { getDiagnosekoder } from '../../utils/dataUtils';
import { logger } from '../../utils/logger';
import { Periode, SykmeldingType } from '../../types/sykmelding/Periode';

import styles from './OpprettPapirsykmelding.module.css';

interface FormValues {
    fnr: string;
    hprNummer: string;
    syketilfelleStartdato: string;
    behandletDato: string;
    diagnosekodesystem: 'icd10' | 'icpc2';
    diagnosekode: string;
    perioder: Periode[];
    utenOcr: boolean;
}

function OpprettPapirsykmelding(): JSX.Element {
    const date = new Date();
    const iGar = format(sub(date, { days: 1 }), 'yyyy-MM-dd');
    const enUkeSiden = format(sub(date, { days: 7 }), 'yyyy-MM-dd');
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormValues>({
        defaultValues: {
            syketilfelleStartdato: enUkeSiden,
            behandletDato: enUkeSiden,
            perioder: [{ fom: enUkeSiden, tom: iGar, type: SykmeldingType.Enum.HUNDREPROSENT }],
        },
    });
    const {
        fields: periodeFields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: 'perioder',
    });
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const OPPRETT_SYKMELDING_URL = `/api/proxy/papirsykmelding/opprett`;
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
        const response = await fetch(OPPRETT_SYKMELDING_URL, {
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
            <Heading size="medium" level="2" spacing>
                Opprett papirsykmelding
            </Heading>
            <TextField
                className={styles.commonFormElement}
                {...register('fnr', { required: true })}
                label="Fødselsnummer"
                error={errors.fnr && 'Fødselsnummer for pasienten mangler'}
            />
            <div className={styles.periodeFields}>
                {periodeFields.map((it, index) => (
                    <div key={it.id} className={styles.periodeFieldRow}>
                        <div>
                            <p>
                                <b>Fom</b>
                            </p>
                            <Controller
                                control={control}
                                name={`perioder.${index}.fom`}
                                render={({ field }) => <Datepicker onChange={field.onChange} value={field.value} />}
                            />
                        </div>
                        <div>
                            <p>
                                <b>Tom</b>
                            </p>
                            <Controller
                                control={control}
                                name={`perioder.${index}.tom`}
                                render={({ field }) => <Datepicker onChange={field.onChange} value={field.value} />}
                            />
                        </div>
                        <Select {...register(`perioder.${index}.type`)} label="Sykmeldingstype">
                            <option value="HUNDREPROSENT">HUNDREPROSENT</option>
                            <option value="AVVENTENDE">AVVENTENDE</option>
                            <option value="GRADERT_20">GRADERT_20</option>
                            <option value="GRADERT_40">GRADERT_40</option>
                            <option value="GRADERT_50">GRADERT_50</option>
                            <option value="GRADERT_60">GRADERT_60</option>
                            <option value="GRADERT_80">GRADERT_80</option>
                            <option value="GRADERT_REISETILSKUDD">GRADERT_REISETILSKUDD</option>
                            <option value="BEHANDLINGSDAGER">BEHANDLINGSDAGER</option>
                            <option value="BEHANDLINGSDAG">BEHANDLINGSDAG</option>
                            <option value="REISETILSKUDD">REISETILSKUDD</option>
                        </Select>
                        <Button type="button" onClick={() => remove(index)} variant="tertiary">
                            Slett
                        </Button>
                    </div>
                ))}
            </div>
            <div className={styles.periodeButton}>
                <Button
                    type="button"
                    onClick={() => append({ fom: enUkeSiden, tom: iGar, type: SykmeldingType.Enum.HUNDREPROSENT })}
                >
                    Legg til periode
                </Button>
            </div>
            <TextField
                className={styles.commonFormElement}
                {...register('hprNummer')}
                label="HPR-nummer"
                defaultValue={'7125186'}
            />
            <p>
                <b>Startdato på syketilfelle</b>
            </p>
            <Controller
                control={control}
                name="syketilfelleStartdato"
                render={({ field }) => <Datepicker onChange={(date) => field.onChange(date)} value={field.value} />}
            />
            <p>
                <b>Behandlingsdato</b>
            </p>
            <Controller
                control={control}
                name="behandletDato"
                render={({ field }) => <Datepicker onChange={(date) => field.onChange(date)} value={field.value} />}
            />
            <Select
                {...register('diagnosekodesystem', { required: true })}
                label="Diagnosekodesystem"
                className={styles.commonFormElement}
            >
                <option value="icd10">ICD10</option>
                <option value="icpc2">ICPC2</option>
            </Select>
            {diagnosekodesystem === 'icd10' && (
                <Select
                    {...register('diagnosekode', { required: true })}
                    label="Diagnosekode"
                    description="Velg tullekode for å få en kode som vil bli avslått i systemet!"
                    className={styles.commonFormElement}
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
                    className={styles.commonFormElement}
                >
                    {icpc2Koder.map((it) => (
                        <option key={it.code} value={it.code}>
                            {it.code + ' - ' + it.text}
                        </option>
                    ))}
                    <option value="tullekode">Tullekode</option>
                </Select>
            )}
            <Checkbox {...register('utenOcr')}>Opprett papirsykmelding uten OCR</Checkbox>
            <Button type="submit">Opprett</Button>
            {error && <Alert variant="error">{error}</Alert>}
            {result && <Alert variant="success">{result}</Alert>}
        </form>
    );
}

export default OpprettPapirsykmelding;

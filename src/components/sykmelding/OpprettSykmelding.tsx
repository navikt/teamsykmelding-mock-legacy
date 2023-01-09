import { Alert, BodyShort, Button, Checkbox, Heading, Label, Select, TextField } from '@navikt/ds-react';
import React, { useState } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { format, sub } from 'date-fns';

import { Periode, SykmeldingType } from '../../types/sykmelding/Periode';
import DiagnosePicker, { Diagnose } from '../formComponents/DiagnosePicker/DiagnosePicker';
import PeriodePicker from '../formComponents/PeriodePicker/PeriodePicker';

import styles from './OpprettSykmelding.module.css';
import SyketilfelleStartdato from './SyketilfelleStartdato';
import Behandletdato from './Behandletdato';
import Kontaktdato from './Kontaktdato';

export interface SykmeldingFormValues {
    fnr: string;
    fnrLege: string;
    herId: string | null;
    meldingTilArbeidsgiver: string | null;
    hprNummer: string;
    syketilfelleStartdato: string;
    annenFraverGrunn: string | null;
    perioder: Periode[];
    behandletDato: string;
    kontaktDato: string | null;
    begrunnIkkeKontakt: string | null;
    vedlegg: boolean;
    virksomhetsykmelding: boolean;
    utdypendeOpplysninger: string | null;
    regelsettVersjon: string | null;
    hoveddiagnose: Diagnose;
    bidiagnoser: [Diagnose] | null;
    arbeidsgiverNavn: string | null;
    vedleggMedVirus: boolean;
}

function OpprettSykmelding(): JSX.Element {
    const date = new Date();
    const iGar = format(sub(date, { days: 1 }), 'yyyy-MM-dd');
    const enUkeSiden = format(sub(date, { days: 7 }), 'yyyy-MM-dd');
    const form = useForm<SykmeldingFormValues>({
        defaultValues: {
            syketilfelleStartdato: enUkeSiden,
            behandletDato: enUkeSiden,
            perioder: [{ fom: enUkeSiden, tom: iGar, type: SykmeldingType.Enum.HUNDREPROSENT }],
            hoveddiagnose: { system: 'icd10', code: 'H100', text: 'Mukopurulent konjunktivitt' },
        },
    });
    const control = form.control;
    const {
        fields: periodeFields,
        append: perioderAppend,
        remove: perioderRemove,
    } = useFieldArray({
        control,
        name: 'perioder',
    });

    const {
        append: bidiagnoserAppend,
        remove: bidiagnoserRemove,
        fields: bidiagnoserFields,
    } = useFieldArray({
        control,
        name: 'bidiagnoser',
    });

    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const OPPRETT_SYKMELDING_URL = `/api/proxy/sykmelding/opprett`;

    const postData = async (data: SykmeldingFormValues): Promise<void> => {
        setError(null);
        setResult(null);
        setRegelError(null);
        setRegelResult(null);
        const mappedData: Omit<SykmeldingFormValues, 'hoveddiagnose'> & {
            diagnosekodesystem: 'icd10' | 'icpc2';
            diagnosekode: string;
        } = {
            ...data,
            kontaktDato: data.kontaktDato ? data.kontaktDato : null,
            annenFraverGrunn: data.annenFraverGrunn ? data.annenFraverGrunn : null,
            herId: data.herId ? data.herId : null,
            meldingTilArbeidsgiver: data.meldingTilArbeidsgiver ? data.meldingTilArbeidsgiver : null,
            begrunnIkkeKontakt: data.begrunnIkkeKontakt ? data.begrunnIkkeKontakt : null,
            utdypendeOpplysninger: data.utdypendeOpplysninger ? data.utdypendeOpplysninger : null,
            diagnosekodesystem: data.hoveddiagnose.system,
            diagnosekode: data.hoveddiagnose.code,
        };
        const response = await fetch(OPPRETT_SYKMELDING_URL, {
            method: 'POST',
            body: JSON.stringify(mappedData),
        });

        if (response.ok) {
            setResult((await response.json()).message);
        } else {
            setError((await response.json()).message);
        }
    };

    const [regelError, setRegelError] = useState<string | null>(null);
    const [regelResult, setRegelResult] = useState<string | null>(null);
    const REGELSJEKK_URL = `/api/proxy/sykmelding/regelsjekk`;
    const postDataRegelsjekk = async (data: SykmeldingFormValues): Promise<void> => {
        setError(null);
        setResult(null);
        setRegelError(null);
        setRegelResult(null);
        const mappedData: Omit<SykmeldingFormValues, 'hoveddiagnose'> & {
            diagnosekodesystem: 'icd10' | 'icpc2';
            diagnosekode: string;
        } = {
            ...data,
            kontaktDato: data.kontaktDato ? data.kontaktDato : null,
            annenFraverGrunn: data.annenFraverGrunn ? data.annenFraverGrunn : null,
            herId: data.herId ? data.herId : null,
            meldingTilArbeidsgiver: data.meldingTilArbeidsgiver ? data.meldingTilArbeidsgiver : null,
            begrunnIkkeKontakt: data.begrunnIkkeKontakt ? data.begrunnIkkeKontakt : null,
            utdypendeOpplysninger: data.utdypendeOpplysninger ? data.utdypendeOpplysninger : null,
            diagnosekodesystem: data.hoveddiagnose.system,
            diagnosekode: data.hoveddiagnose.code,
        };
        const response = await fetch(REGELSJEKK_URL, {
            method: 'POST',
            body: JSON.stringify(mappedData),
        });

        if (response.ok) {
            setRegelResult(JSON.stringify(await response.json(), null, 2));
        } else {
            setRegelError((await response.json()).message);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(postData)}>
                <Heading size="medium" level="2" spacing>
                    Opprett sykmelding
                </Heading>
                <TextField
                    className={styles.commonFormElement}
                    {...form.register('fnr', { required: true })}
                    label="Fødselsnummer"
                    error={form.formState.errors.fnr && 'Fødselsnummer for pasienten mangler'}
                />
                <div className={styles.periodeFields}>
                    {periodeFields.map((it, index) => (
                        <div key={it.id} className={styles.periodeFieldRow}>
                            <PeriodePicker name={`perioder.${index}`} />
                            <Select {...form.register(`perioder.${index}.type`)} label="Sykmeldingstype">
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
                            <Button type="button" onClick={() => perioderRemove(index)} variant="tertiary">
                                Slett
                            </Button>
                        </div>
                    ))}
                </div>
                <div className={styles.periodeButton}>
                    <Button
                        type="button"
                        onClick={() =>
                            perioderAppend({
                                fom: enUkeSiden,
                                tom: iGar,
                                type: SykmeldingType.Enum.HUNDREPROSENT,
                            })
                        }
                    >
                        Legg til periode
                    </Button>
                </div>
                <TextField
                    className={styles.commonFormElement}
                    {...form.register('fnrLege', { required: true })}
                    label="Fødselsnummer til lege"
                    defaultValue={'01117302624'}
                    error={form.formState.errors.fnrLege && 'Fødselsnummer til lege mangler'}
                />
                <TextField className={styles.commonFormElement} {...form.register('herId')} label="HER-id" />
                <TextField
                    className={styles.commonFormElement}
                    {...form.register('hprNummer')}
                    label="HPR-nummer"
                    defaultValue={'7125186'}
                />
                <div className={styles.commonFormElement}>
                    <SyketilfelleStartdato />
                </div>
                <div className={styles.commonFormElement}>
                    <Label>Hoveddiagnose</Label>
                    <DiagnosePicker name={'hoveddiagnose'} diagnoseType={'hoveddiagnose'} />
                    <BodyShort size="small">
                        Velg tullekode i Diagnosekode for å få en kode som vil bli avslått i systemet!
                    </BodyShort>
                </div>
                <div className={styles.commonFormElement}>
                    <Label>Bidiagnose</Label>
                    {bidiagnoserFields.map((field, index) => (
                        <DiagnosePicker
                            key={field.id}
                            name={`bidiagnoser.${index}`}
                            diagnoseType="bidiagnose"
                            onRemove={() => bidiagnoserRemove(index)}
                        />
                    ))}
                    <div>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                bidiagnoserAppend({ system: 'icd10', code: '', text: '' }, { shouldFocus: true })
                            }
                            type="button"
                        >
                            Legg til bidiagnose
                        </Button>
                    </div>
                </div>
                <TextField
                    className={styles.commonFormElement}
                    {...form.register('arbeidsgiverNavn')}
                    label="Arbeidsgiver navn"
                />
                <TextField
                    className={styles.commonFormElement}
                    {...form.register('meldingTilArbeidsgiver')}
                    label="Melding til arbeidsgiver"
                />
                <Select
                    {...form.register('annenFraverGrunn')}
                    label="Annen fraværsårsak"
                    className={styles.commonFormElement}
                >
                    <option value="">Velg</option>
                    <option value="GODKJENT_HELSEINSTITUSJON">
                        Når vedkommende er innlagt i en godkjent helseinstitusjon
                    </option>
                    <option value="BEHANDLING_FORHINDRER_ARBEID">
                        Når vedkommende er under behandling og lege erklærer at behandlingen gjør det nødvendig at
                        vedkommende ikke arbeider
                    </option>
                    <option value="ARBEIDSRETTET_TILTAK">Når vedkommende deltar på et arbeidsrettet tiltak</option>
                    <option value="MOTTAR_TILSKUDD_GRUNNET_HELSETILSTAND">
                        Når vedkommende på grunn av sykdom, skade eller lyte får tilskott når vedkommende på grunn av
                        sykdom, skade eller lyte får tilskott
                    </option>
                    <option value="NODVENDIG_KONTROLLUNDENRSOKELSE">
                        Når vedkommende er til nødvendig kontrollundersøkelse som krever minst 24 timers fravær,
                        reisetid medregnet
                    </option>
                    <option value="SMITTEFARE">
                        Når vedkommende myndighet har nedlagt forbud mot at han eller hun arbeider på grunn av
                        smittefare
                    </option>
                    <option value="ABORT">Når vedkommende er arbeidsufør som følge av svangerskapsavbrudd</option>
                    <option value="UFOR_GRUNNET_BARNLOSHET">
                        Når vedkommende er arbeidsufør som følge av behandling for barnløshet
                    </option>
                    <option value="DONOR">Når vedkommende er donor eller er under vurdering som donor</option>
                    <option value="BEHANDLING_STERILISERING">
                        Når vedkommende er arbeidsufør som følge av behandling i forbindelse med sterilisering
                    </option>
                </Select>
                <div className={styles.commonFormElement}>
                    <Behandletdato />
                </div>
                <div className={styles.commonFormElement}>
                    <Kontaktdato />
                </div>
                <TextField
                    className={styles.commonFormElement}
                    {...form.register('begrunnIkkeKontakt')}
                    label="Tilbakedatering: Begrunnelse"
                />
                <Checkbox {...form.register('vedlegg')}>Vedlegg</Checkbox>
                <Checkbox {...form.register('vedleggMedVirus')}>Vedlegg med virus</Checkbox>
                <Checkbox {...form.register('virksomhetsykmelding')}>Virksomhetsykmelding</Checkbox>
                <Select
                    {...form.register('utdypendeOpplysninger')}
                    label="Utdypende opplysninger"
                    className={styles.commonFormElement}
                >
                    <option value="">Velg</option>
                    <option value="INGEN">Ingen utdypende opplysninger (alle regelsettversjoner)</option>
                    <option value="UKE_7">Utdypende opplysninger ved uke 7</option>
                    <option value="UKE_17"> Utdypende opplysninger ved uke 17</option>
                    <option value="UKE_39">Utdypende opplysninger ved uke 39</option>
                </Select>
                <BodyShort size="small">
                    Utdypende opplysninger for uke 7, 17 og 39 påvirker kun regelsettversjon 3.
                </BodyShort>
                <TextField
                    className={styles.commonFormElement}
                    {...form.register('regelsettVersjon')}
                    label="Regelsettversjon"
                    defaultValue={'3'}
                />
                <div className={styles.buttons}>
                    <Button type="submit">Opprett</Button>
                    {error && <Alert variant="error">{error}</Alert>}
                    {result && <Alert variant="success">{result}</Alert>}
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={async () => {
                            const validationResult = await form.trigger(undefined, { shouldFocus: true });
                            if (!validationResult) {
                                return;
                            }
                            return postDataRegelsjekk(form.getValues());
                        }}
                    >
                        Valider mot regler
                    </Button>
                    {regelError && <Alert variant="error">{regelError}</Alert>}
                    {regelResult && <Alert variant="success">{regelResult}</Alert>}
                </div>
            </form>
        </FormProvider>
    );
}

export default OpprettSykmelding;

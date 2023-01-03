/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, BodyShort, Button, Checkbox, Heading, Label, Select, TextField } from '@navikt/ds-react';
import React, { useState } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { format, sub } from 'date-fns';
import { Datepicker } from '@navikt/ds-datepicker';

import { Periode, SykmeldingType } from '../../types/sykmelding/Periode';
import DiagnosePicker, { Diagnose } from '../formComponents/DiagnosePicker/DiagnosePicker';

import styles from './OpprettSykmelding.module.css';

interface FormValues {
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
    const {
        getValues,
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            syketilfelleStartdato: enUkeSiden,
            behandletDato: enUkeSiden,
            perioder: [{ fom: enUkeSiden, tom: iGar, type: SykmeldingType.Enum.HUNDREPROSENT }],
            hoveddiagnose: { system: 'icd10', code: 'H100', text: 'Mukopurulent konjunktivitt' },
        },
    });
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

    const postData = async (data: FormValues): Promise<void> => {
        const mappedData: Omit<FormValues, 'hoveddiagnose'> & {
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
    const postDataRegelsjekk = async (data: FormValues): Promise<void> => {
        const mappedData: Omit<FormValues, 'hoveddiagnose'> & {
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
            setRegelResult((await response.json()).message);
        } else {
            setRegelError((await response.json()).message);
        }
    };

    return (
        <form onSubmit={handleSubmit(postData)}>
            <Heading size="medium" level="2" spacing>
                Opprett sykmelding
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
                {...register('fnrLege', { required: true })}
                label="Fødselsnummer til lege"
                defaultValue={'01117302624'}
                error={errors.fnrLege && 'Fødselsnummer til lege mangler'}
            />
            <TextField className={styles.commonFormElement} {...register('herId')} label="HER-id" />
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
            <Label>Hoveddiagnose</Label>
            <DiagnosePicker control={control as any} name={'hoveddiagnose'} diagnoseType={'hoveddiagnose'}>
                <BodyShort size="small">
                    Velg tullekode i Diagnosekode for å få en kode som vil bli avslått i systemet!
                </BodyShort>
            </DiagnosePicker>
            <Label>Bidiagnose</Label>
            {bidiagnoserFields.map((field, index) => (
                <DiagnosePicker
                    key={field.id}
                    name={`bidiagnoser.${index}`}
                    diagnoseType="bidiagnose"
                    control={control as any}
                    onRemove={() => bidiagnoserRemove(index)}
                />
            ))}
            <div>
                <Button
                    variant="secondary"
                    onClick={() => bidiagnoserAppend({ system: 'icd10', code: '', text: '' }, { shouldFocus: true })}
                    type="button"
                >
                    Legg til bidiagnose
                </Button>
            </div>
            <TextField
                className={styles.commonFormElement}
                {...register('arbeidsgiverNavn')}
                label="Arbeidsgiver navn"
            />
            <TextField
                className={styles.commonFormElement}
                {...register('meldingTilArbeidsgiver')}
                label="Melding til arbeidsgiver"
            />
            <Select {...register('annenFraverGrunn')} label="Annen fraværsårsak" className={styles.commonFormElement}>
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
                    Når vedkommende er til nødvendig kontrollundersøkelse som krever minst 24 timers fravær, reisetid
                    medregnet
                </option>
                <option value="SMITTEFARE">
                    Når vedkommende myndighet har nedlagt forbud mot at han eller hun arbeider på grunn av smittefare
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
            <p>
                <b>Behandlingsdato</b>
            </p>
            <Controller
                control={control}
                name="behandletDato"
                render={({ field }) => <Datepicker onChange={(date) => field.onChange(date)} value={field.value} />}
            />
            <p>
                <b>Tilbakedatering: Kontaktdato</b>
            </p>
            <Controller
                control={control}
                name="kontaktDato"
                render={({ field }) => (
                    <Datepicker onChange={(date) => field.onChange(date)} value={field.value ?? undefined} />
                )}
            />
            <TextField
                className={styles.commonFormElement}
                {...register('begrunnIkkeKontakt')}
                label="Tilbakedatering: Begrunnelse"
            />
            <Checkbox {...register('vedlegg')}>Vedlegg</Checkbox>
            <Checkbox {...register('vedleggMedVirus')}>Vedlegg med virus</Checkbox>
            <Checkbox {...register('virksomhetsykmelding')}>Virksomhetsykmelding</Checkbox>
            <Select
                {...register('utdypendeOpplysninger')}
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
                {...register('regelsettVersjon')}
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
                    onClick={() => {
                        return postDataRegelsjekk(getValues());
                    }}
                >
                    Valider mot regler
                </Button>
                {regelError && <Alert variant="error">{regelError}</Alert>}
                {regelResult && <Alert variant="success">{regelResult}</Alert>}
            </div>
        </form>
    );
}

export default OpprettSykmelding;

import React, { ReactElement, useState } from 'react'
import { Alert, Button, Checkbox, Heading, Label, TextField } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'

import DiagnosePicker, { Diagnose } from '../formComponents/DiagnosePicker/DiagnosePicker'
import styles from '../legeerklaering/OpprettLegeerklaering.module.css'

interface FormValues {
    fnr: string
    fnrLege: string
    statusPresens: string
    vedlegg: boolean
    vedleggMedVirus: boolean
    hoveddiagnose: Diagnose
}

type OpprettLegeerklaeringApiBody = Omit<FormValues, 'hoveddiagnose'> & {
    diagnosekodesystem: 'icd10' | 'icpc2'
    diagnosekode: string
}

function OpprettLegeerklaering(): ReactElement {
    const form = useForm<FormValues>({
        defaultValues: {
            hoveddiagnose: { system: 'icd10', code: 'H100', text: 'Mukopurulent konjunktivitt' },
        },
    })
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<string | null>(null)
    const OPPRETT_LEGEERKLAERING_URL = `/api/proxy/legeerklaering/opprett`

    const postData = async (data: FormValues): Promise<void> => {
        setError(null)
        setResult(null)
        const postData: OpprettLegeerklaeringApiBody = {
            fnr: data.fnr,
            fnrLege: data.fnrLege,
            statusPresens: data.statusPresens,
            vedlegg: data.vedlegg,
            vedleggMedVirus: data.vedleggMedVirus,
            diagnosekodesystem: data.hoveddiagnose.system,
            diagnosekode: data.hoveddiagnose.code,
        }

        const response = await fetch(OPPRETT_LEGEERKLAERING_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        })

        if (response.ok) {
            setResult((await response.json()).message)
        } else {
            setError((await response.json()).message)
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(postData)}>
                <Heading size="medium" level="2" spacing>
                    Opprett legeerklæring
                </Heading>
                <p />
                <TextField
                    className={styles.commonFormElement}
                    {...form.register('fnr', { required: true })}
                    label="Fødselsnummer"
                    error={form.formState.errors.fnr && 'Fødselsnummer for pasienten mangler'}
                />
                <TextField
                    className={styles.commonFormElement}
                    {...form.register('fnrLege', { required: true })}
                    label="Fødselsnummer til lege"
                    defaultValue="04056600324"
                    error={form.formState.errors.fnrLege && 'Fødselsnummer til lege mangler'}
                />
                <div className={styles.commonFormElement}>
                    <Label>Hoveddiagnose</Label>
                    <DiagnosePicker name="hoveddiagnose" diagnoseType="hoveddiagnose" />
                </div>
                <TextField
                    className={styles.commonFormElement}
                    {...form.register('statusPresens')}
                    label="Status presens"
                />
                <Checkbox className={styles.commonFormElement} {...form.register('vedlegg')}>
                    Vedlegg
                </Checkbox>
                <Checkbox className={styles.commonFormElement} {...form.register('vedleggMedVirus')}>
                    Vedlegg med virus
                </Checkbox>
                <Button type="submit">Opprett</Button>
                {error && <Alert variant="error">{error}</Alert>}
                {result && <Alert variant="success">{result}</Alert>}
            </form>
        </FormProvider>
    )
}

export default OpprettLegeerklaering

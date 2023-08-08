'use client'

import { Alert, Button, TextField } from '@navikt/ds-react'
import { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'

interface FormValues {
    fnr: string
    antallPdfs: number
}

function OpprettUtenlandskPapirsykmelding(): ReactElement {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()
    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const OPPRETT_SYKMELDING_URL = `/api/proxy/utenlands/opprett`

    const postData = async (data: FormValues): Promise<void> => {
        setError(null)
        setResult(null)
        const response = await fetch(OPPRETT_SYKMELDING_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fnr: data.fnr,
                antallPdfs: data.antallPdfs,
            }),
        })

        if (response.ok) {
            setResult((await response.json()).message)
        } else {
            setError((await response.json()).message)
        }
    }

    return (
        <form onSubmit={handleSubmit(postData)}>
            <TextField
                {...register('fnr', { required: true })}
                label="Fødselsnummer"
                error={errors.fnr && 'Fødselsnummer mangler'}
            />
            <TextField
                label="Antall PDFs"
                {...register('antallPdfs', { required: true })}
                error={errors.antallPdfs && 'Antall PDFs mangler'}
            />
            <p />
            <Button type="submit">Opprett</Button>
            <p />
            {error && <Alert variant="error">{error}</Alert>}
            {result && <Alert variant="success">{result}</Alert>}
        </form>
    )
}

export default OpprettUtenlandskPapirsykmelding

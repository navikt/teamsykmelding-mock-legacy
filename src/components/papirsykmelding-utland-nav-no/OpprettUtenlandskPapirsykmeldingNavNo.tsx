'use client'

import { Button, TextField } from '@navikt/ds-react'
import { ReactElement } from 'react'
import { useForm } from 'react-hook-form'

import { useProxyAction } from '../../proxy/api-hooks'
import ProxyFeedback from '../../proxy/proxy-feedback'

interface FormValues {
    fnr: string
}

function OpprettUtenlandskPapirsykmelding(): ReactElement {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()
    const [postData, { result, error, loading }] = useProxyAction<{ fnr: string }>('/utenlands/nav/opprett')

    return (
        <form onSubmit={handleSubmit((values) => postData(values))}>
            <TextField
                {...register('fnr', { required: true })}
                label="Fødselsnummer"
                error={errors.fnr && 'Fødselsnummer mangler'}
            />
            <ProxyFeedback error={error} result={result}>
                <Button type="submit" loading={loading}>
                    Opprett
                </Button>
            </ProxyFeedback>
        </form>
    )
}

export default OpprettUtenlandskPapirsykmelding

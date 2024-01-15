'use client'

import { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { useForm } from 'react-hook-form'

import { useProxyAction } from '../../proxy/api-hooks'
import ProxyFeedback from '../../proxy/proxy-feedback'
import FnrTextField from '../formComponents/FnrTextField'

interface FormValues {
    fnr: string
}

function OpprettUtenlandskPapirsykmelding(): ReactElement {
    const {
        register,
        handleSubmit,
        formState: {},
    } = useForm<FormValues>()

    const [postData, { result, error, loading }] = useProxyAction('/papirsykmelding/utenlandsk/opprett')

    return (
        <form onSubmit={handleSubmit((values) => postData(undefined, { fnr: values.fnr }))}>
            <FnrTextField {...register('fnr')} label="Fødselsnummer" />
            <ProxyFeedback error={error} result={result}>
                <Button type="submit" loading={loading}>
                    Opprett
                </Button>
            </ProxyFeedback>
        </form>
    )
}

export default OpprettUtenlandskPapirsykmelding

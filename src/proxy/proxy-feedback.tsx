import { PropsWithChildren, ReactElement, useEffect, useRef } from 'react'
import { Alert } from '@navikt/ds-react'
import confetti from 'canvas-confetti'

type ProxyFeedbackProps = {
    error: string | null
    result: string | null
}

function ProxyFeedback({ result, error, children }: PropsWithChildren<ProxyFeedbackProps>): ReactElement | null {
    const buttonParentRef = useRef<HTMLDivElement>(null)
    const feedback = error ? (
        <Alert variant="error">{error}</Alert>
    ) : result ? (
        <Alert variant="success">{result}</Alert>
    ) : null

    useEffect(() => {
        if (result) {
            confetti({ origin: { y: 1 } })
        }
    }, [result])

    return (
        <div className="mt-4 relative">
            <div ref={buttonParentRef} className="flex flex-row gap-4">
                {children}
            </div>
            {feedback ? <div className="h-24 mt-4">{feedback}</div> : <div className="mt-4 h-24" />}
        </div>
    )
}

export default ProxyFeedback

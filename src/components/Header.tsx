import React, { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react/esm/typography'

import { ChatIcon } from './aksel/icons'

function Header(): ReactElement {
    return (
        <div className="p-4 border-b border-b-border-subtle flex justify-between">
            <Heading size="large" level="1">
                Team Sykmelding Mock
            </Heading>
            <a
                href="https://nav-it.slack.com/archives/CMA3XV997"
                target="_blank"
                rel="noreferrer"
                className="flex items-center"
            >
                <ChatIcon className="mr-2" />
                <span>#team-sykmelding</span>
            </a>
        </div>
    )
}

export default Header

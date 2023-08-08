import 'next-logger'
import '@navikt/next-logger'

import { NextApiRequest, NextApiResponse } from 'next'
import { proxyApiRouteRequest } from '@navikt/next-api-proxy'

import { getEnv } from '../../../utils/env'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (process.env.NODE_ENV !== 'production') {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        res.status(200).json({ message: 'Jobber lokalt, 200 ok læll' })
        return
    }

    const rewrittenPath = req.url!.replace(`/api/proxy`, '')
    await proxyApiRouteRequest({
        path: rewrittenPath,
        req,
        res,
        hostname: getEnv('MOCK_BACKEND_URL'),
        https: false,
    })
}

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
}

export default handler

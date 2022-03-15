import { NextApiRequest, NextApiResponse } from 'next';

import { getEnv } from '../../utils/env';
import { logger } from '../../utils/logger';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (!Array.isArray(req.query.proxy)) {
        res.status(400).json({ message: 'Invalid request' });
        return;
    }

    if (process.env.NODE_ENV !== 'production') {
        res.status(200).json({ message: 'Jobber lokalt, 200 ok læll' });
        return;
    }

    const path = req.query.proxy.slice(1).join('/');
    const result = await fetch(`${getEnv('MOCK_BACKEND_URL')}/${path}`, {
        method: req.method,
        body: getBody(req),
        headers: getHeaders(req),
    });

    if (!result.ok) {
        logger.error('Proxy request failed');
        logger.error(`${result.status} ${result.statusText}`);
        res.status(result.status).json({ message: `Noe gikk galt: ${result.statusText}` });
        return;
    }

    res.status(result.status).json(await result.json());
};

function getBody(req: NextApiRequest): string | undefined {
    return req.method === 'GET' || req.method === 'DELETE' ? undefined : req.body;
}

function getHeaders(req: NextApiRequest): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (req.headers['Sykmeldt-Fnr']) {
        headers['Sykmeldt-Fnr'] = req.headers['Sykmeldt-Fnr'] as string;
    }

    return headers;
}

export default handler;

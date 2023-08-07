import Fuse from 'fuse.js';
import { NextApiRequest, NextApiResponse } from 'next';

import icd10 from './data/icd10.json';
import icpc2 from './data/icpc2.json';

const fuseIcd10 = new Fuse([...icd10, { code: 'tullekode', text: 'Tullekode' }], {
    keys: ['code', 'text'],
    threshold: 0.2,
});
const fuseIcpc2 = new Fuse([...icpc2, { code: 'tullekode', text: 'Tullekode' }], {
    keys: ['code', 'text'],
    threshold: 0.2,
});

export interface DiagnoseSuggestion {
    code: string;
    text: string;
}

export interface DiagnoseSearchResult {
    suggestions: DiagnoseSuggestion[];
}

const diagnoseSearch = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const { system, value } = req.query;

    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not supported' });
        return;
    }

    if (system !== 'icd10' && system !== 'icpc2') {
        res.status(400).json({ message: `${system} is not a valid kodesystem` });
        return;
    }

    if (value == null || typeof value !== 'string') {
        res.status(400).json({ message: `Missing search value query parameter` });
        return;
    }

    res.status(200).json({ suggestions: searchSystem(system, value) });
};

export function searchSystem(system: 'icd10' | 'icpc2', value: string): DiagnoseSuggestion[] {
    if (system === 'icd10') {
        if ((value ?? '').trim() === '') {
            return icd10.slice(0, 100);
        }

        return fuseIcd10
            .search(value)
            .map((it) => it.item)
            .slice(0, 100);
    } else {
        if ((value ?? '').trim() === '') {
            return icpc2.slice(0, 100);
        }

        return fuseIcpc2
            .search(value)
            .map((it) => it.item)
            .slice(0, 100);
    }
}

export default diagnoseSearch;

'use server'

import Fuse from 'fuse.js'

import icd10 from './data/icd10.json'
import icpc2 from './data/icpc2.json'

const fuseIcd10 = new Fuse([...icd10, { code: 'tullekode', text: 'Tullekode' }], {
    keys: ['code', 'text'],
    threshold: 0.2,
})
const fuseIcpc2 = new Fuse([...icpc2, { code: 'tullekode', text: 'Tullekode' }], {
    keys: ['code', 'text'],
    threshold: 0.2,
})

export interface DiagnoseSuggestion {
    code: string
    text: string
}

export interface DiagnoseSearchResult {
    suggestions: DiagnoseSuggestion[]
}

export const diagnoseSearch = async (system: string, value: string): Promise<{ suggestions: DiagnoseSuggestion[] }> => {
    if (system !== 'icd10' && system !== 'icpc2') {
        throw new Error(`${system} is not a valid kodesystem`)
    }

    if (value == null || typeof value !== 'string') {
        throw new Error(`Missing search value query parameter`)
    }

    return { suggestions: searchSystem(system, value) }
}

function searchSystem(system: 'icd10' | 'icpc2', value: string): DiagnoseSuggestion[] {
    if (system === 'icd10') {
        if ((value ?? '').trim() === '') {
            return icd10.slice(0, 100)
        }

        return fuseIcd10
            .search(value)
            .map((it) => it.item)
            .slice(0, 100)
    } else {
        if ((value ?? '').trim() === '') {
            return icpc2.slice(0, 100)
        }

        return fuseIcpc2
            .search(value)
            .map((it) => it.item)
            .slice(0, 100)
    }
}

import { Diagnosekoder, DiagnosekodeSystem } from '../types/diagnosekoder/Diagnosekoder';

import { logger } from './logger';

export const getDiagnosekoder = async (): Promise<Diagnosekoder> => {
    try {
        const diagnosekoderRaw = {
            [DiagnosekodeSystem.ICD10]: (await import('../data/icd10.json')).default,
            [DiagnosekodeSystem.ICPC2]: (await import('../data/icpc2.json')).default,
        };
        return Diagnosekoder.parse(diagnosekoderRaw);
    } catch (error: unknown) {
        logger.error(error);
        throw new Error('Feil med diagnosekoder. Sjekk logger for utdypende feilbeskrivelse');
    }
};

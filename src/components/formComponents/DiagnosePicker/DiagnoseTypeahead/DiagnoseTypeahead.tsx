import '@reach/combobox/styles.css';

import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { ComboboxList } from '@reach/combobox';

import type { DiagnoseSearchResult, DiagnoseSuggestion } from '../../../../pages/api/diagnose/[system]';
import {
    ComboboxWrapper,
    DsCombobox,
    DsComboboxInput,
    DsComboboxNoResult,
    DsComboboxOption,
    DsComboboxPopover,
} from '../CustomFormComponents/Combobox';
import { DiagnoseSystem } from '../DiagnosePicker';

interface Props {
    id?: string;
    system: DiagnoseSystem;
    onSelect: (value: DiagnoseSuggestion) => void;
}

function DiagnoseTypeahead({ id, system, onSelect }: Props): JSX.Element {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const suggestions = useDiagnoseSuggestions(system, searchTerm);
    const handleSearchTermChange: ChangeEventHandler<HTMLInputElement> = (event): void => {
        setSearchTerm(event.target.value);
    };

    return (
        <ComboboxWrapper label="Diagnosekode">
            <DsCombobox
                openOnFocus
                aria-label={`Søk i ${system} diagnoser`}
                onSelect={(item) => {
                    const diagnose = suggestions.find((it) => it.code === item);
                    if (!diagnose) {
                        console.warn(
                            `Diagnose was not found in suggestions in diagnose typeahead. Diagnose: ${diagnose}, suggestions: ${suggestions.map(
                                (it) => it.code,
                            )}`,
                        );
                        return;
                    }

                    onSelect(diagnose);
                }}
            >
                <DsComboboxInput
                    id={id}
                    onChange={handleSearchTermChange}
                    placeholder={`Søk i ${system} diagnoser...`}
                />
                {suggestions && (
                    <DsComboboxPopover>
                        {suggestions.length > 0 ? (
                            <ComboboxList>
                                {suggestions.map((suggestion) => (
                                    <DsComboboxOption key={suggestion.code} value={suggestion.code} />
                                ))}
                            </ComboboxList>
                        ) : searchTerm.trim() === '' ? (
                            <DsComboboxNoResult text={`Søk i ${system} diagnoser`} />
                        ) : (
                            <DsComboboxNoResult
                                text={`Fant ingen diagnose med kode eller beskrivelse "${searchTerm}"`}
                            />
                        )}
                    </DsComboboxPopover>
                )}
            </DsCombobox>
        </ComboboxWrapper>
    );
}

function useDiagnoseSuggestions(system: DiagnoseSystem, searchTerm: string): DiagnoseSuggestion[] {
    const [suggestions, setSuggestions] = useState<DiagnoseSuggestion[]>([]);

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            let isCurrentSearch = true;
            fetchDiagnoseSuggestions(system, searchTerm).then((result) => {
                if (isCurrentSearch) setSuggestions(result.suggestions);
            });

            return () => {
                isCurrentSearch = false;
            };
        }
    }, [searchTerm, system]);

    return suggestions;
}

const cache: Record<string, DiagnoseSearchResult> = {};

async function fetchDiagnoseSuggestions(system: DiagnoseSystem, value: string): Promise<DiagnoseSearchResult> {
    if (cache[`${system}-${value}`]) {
        return cache[value];
    }

    const result = await fetch(`/api/diagnose/${system.toLowerCase()}?value=${value}`).then((res) => res.json());
    cache[value] = result;
    return result;
}

export default DiagnoseTypeahead;

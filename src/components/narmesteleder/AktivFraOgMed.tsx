import { useController } from 'react-hook-form';
import { UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import { format } from 'date-fns';

import { toDate } from '../../utils/dateUtils';

import { NarmestelederFormValues } from './OpprettNarmesteleder';

function AktivFraOgMed(): JSX.Element {
    const { field } = useController<NarmestelederFormValues, 'aktivFom'>({ name: 'aktivFom' });

    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
        today: new Date(),
        defaultSelected: field.value ? toDate(field.value) : undefined,
        onDateChange: (date: Date | undefined) => {
            field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined);
        },
    });

    return (
        <UNSAFE_DatePicker {...datepickerProps}>
            <UNSAFE_DatePicker.Input
                id={field.name}
                {...inputProps}
                label="Aktiv fra og med"
                placeholder="DD.MM.ÅÅÅÅ"
            />
        </UNSAFE_DatePicker>
    );
}

export default AktivFraOgMed;

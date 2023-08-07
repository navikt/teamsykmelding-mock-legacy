import { useController } from 'react-hook-form';
import { UNSAFE_DatePicker, UNSAFE_useRangeDatepicker } from '@navikt/ds-react';
import { format } from 'date-fns';

import { toDate } from '../../../utils/dateUtils';

import styles from './PeriodePicker.module.css';

type DateRange = {
    from: Date | undefined;
    to?: Date | undefined;
};

type FormName = `perioder.${number}`;

interface PeriodePickerProps {
    name: FormName;
}

function PeriodePicker({ name }: PeriodePickerProps): JSX.Element {
    const { field: fromField } = useController({
        name: `${name}.fom`,
        rules: { required: 'Du må fylle inn fra-dato.' },
    });
    const { field: toField } = useController({
        name: `${name}.tom`,
        rules: { required: 'Du må fylle inn til-dato.' },
    });

    const { datepickerProps, toInputProps, fromInputProps } = UNSAFE_useRangeDatepicker({
        defaultSelected: {
            from: fromField.value ? toDate(fromField.value) : undefined,
            to: toField.value ? toDate(toField.value) : undefined,
        },
        onRangeChange: (value: DateRange | undefined) => {
            fromField.onChange(value?.from ? format(value.from, 'yyyy-MM-dd') : undefined);
            toField.onChange(value?.to ? format(value.to, 'yyyy-MM-dd') : undefined);
        },
    });

    return (
        <div className={styles.periodePicker}>
            <UNSAFE_DatePicker {...datepickerProps} wrapperClassName={styles.dateRangePicker}>
                <UNSAFE_DatePicker.Input id={fromField.name} {...fromInputProps} label="Fra" placeholder="DD.MM.ÅÅÅÅ" />
                <UNSAFE_DatePicker.Input id={toField.name} {...toInputProps} label="Til" placeholder="DD.MM.ÅÅÅÅ" />
            </UNSAFE_DatePicker>
        </div>
    );
}

export default PeriodePicker;

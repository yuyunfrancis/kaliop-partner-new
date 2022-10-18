import React, {useCallback} from 'react';

export default function usePriceFormat(locale= 'fr-FR', currency = 'XAF'){

    const format = useCallback((number) => {
        return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(number)
    }, [])

    return [format];
}
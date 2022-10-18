import React, { useEffect, useState } from 'react';
// import Error from '../components/Error';

const userError = (err) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(err);
    }, [err])

    return [error];
};

export default userError;
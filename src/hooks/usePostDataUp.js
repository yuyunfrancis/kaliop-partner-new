import React, { useState, useContext } from 'react';
import { Snackbar } from 'react-native-paper';

const usePostDataUp = (url, method = 'POST') => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [visible, setVisible] = React.useState(false);

    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    async function postData(formData, ...rest) {
        try {
            setLoading(true);

            const data = await fetch(url, {
                method: method,
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            //     .then((response) => {
            //     response.json().then((data) => {
            //         console.log('data', data)
            //         setResult(data)
            //     })
            // }).catch(err => {
            //     console.log(err)
            // })

            const res = data.json()
            setLoading(false);

            if (res.status >= 300) {
                setError(
                    <Snackbar
                        visible={visible}
                        onDismiss={onDismissSnackBar}
                        action={{
                            label: 'Undo',
                            onPress: () => {
                            },
                        }}>
                        {res.message}
                    </Snackbar>
                );
                onToggleSnackBar();
                setResult(res)
                return result;
            }
            setResult(res)

            return result

        } catch (e) {
            setError(
                <Snackbar
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: 'Undo',
                        onPress: () => {
                        },
                    }}>
                    {e.message}
                </Snackbar>
            );
            onToggleSnackBar();
            console.log('error', e.message)
            setLoading(false);
        }
    }

    return [loading, error, postData]
};

export default usePostDataUp;
import React, {useEffect, useState} from 'react';
import {Snackbar} from 'react-native-paper';

const UseHasSnackAlert = () => {
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    setError(null);
    setNetworkError(
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Undo',
          onPress: () => {},
        }}>
        {networkError}
      </Snackbar>,
    );
  }, []);

  return [error, networkError];
};

export default UseHasSnackAlert;

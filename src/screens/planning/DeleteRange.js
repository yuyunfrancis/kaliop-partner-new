import * as React from 'react';
import {useContext, useState, useEffect} from 'react';
import {
  Button,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
  Text,
} from 'react-native-paper';
import {COLORS} from '../../constants';
import axios from 'axios';
import {config} from '../../constants/config';
import Loader from '../../components/Loader';
import UserContext from '../../contexts/UserContext';

export default function DeleteRange(props) {
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {user} = useContext(UserContext);
  const {range, day} = props;

  // console.log('day', day)

  const start = new Date(range.start);
  const end = new Date(range.end);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setVisible(false);
    setLoading(false);
  };

  const onRefresh = () => {
    setLoading(true);
  };

  async function handleDeleteFarm() {
    setLoading(true);
    const configurationData = {
      method: 'DELETE',
      url: `${config.app.api_url}/ranges/${range._id}`,
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    };
    await axios(configurationData)
      .then(response => {
        setLoading(false);
        if (response.data.status === 'success') {
          hideDialog();
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('delete range error', error);
      });
  }

  return (
    <>
      <IconButton icon={'close'} color={'gray'} onPress={showDialog} />
      <Portal>
        <Dialog
          style={{borderRadius: 12}}
          visible={visible}
          onDismiss={hideDialog}>
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              You really want to delete the range{' '}
              <Text style={{fontWeight: 'bold'}}>
                {day.name}{' '}
                {start.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour24: true,
                })}{' '}
                to{' '}
                {end.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour24: true,
                })}
              </Text>{' '}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="outlined" color={COLORS.primary} onPress={hideDialog}>
              Cancel
            </Button>
            {loading && (
              <Button mode="text">
                <Loader color={COLORS.primary} />
              </Button>
            )}
            {!loading && (
              <Button
                mode="text"
                color={COLORS.red}
                onPress={() => handleDeleteFarm()}>
                Delete
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

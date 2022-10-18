import React, {useContext, useEffect, useLayoutEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {COLORS} from './src/constants';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import './assets/i18n/i18n';

import {AuthNavigator, ScreenNavigator} from './src/navigation';

import UserContext, {UserContextProvider} from './src/contexts/UserContext';
import {navigationRef} from './src/navigation/routing';

export default function App() {
  const [sessionLocale] = React.useState(null);
  const [mounted, setMounted] = React.useState(null);

  const paperTheme = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
      ...DefaultTheme.colors,
      primary: COLORS.primary,
      accent: COLORS.secondary,
    },
  };

  function Navigator() {
    const {user, error, getUser, setUser, logoutUser} = useContext(UserContext);

    useEffect(() => {
      getUser();
    }, []);

    useLayoutEffect(() => {
      setMounted(true);
    }, []);
    console.log(user);
    return (
      <>
        {mounted && (
          <NavigationContainer ref={navigationRef}>
            {user !== null ? (
              <ScreenNavigator sessionLocale={sessionLocale} />
            ) : (
              <AuthNavigator />
            )}
          </NavigationContainer>
        )}
      </>
    );
  }

  return (
    <>
      <UserContextProvider>
        <PaperProvider theme={paperTheme}>
          <Navigator />
        </PaperProvider>
      </UserContextProvider>
    </>
  );
}

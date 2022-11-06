import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });  


  declare global {
    var token: string;
  }

export default function App() {
    useEffect(() => {
        registerForPushNotificationsAsync().catch(error => console.log('error: ', error));;
    }, []);
    async function registerForPushNotificationsAsync() {
        let token;
    
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
    
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
        global.token = token;
        // console.log(global.token);
        return token;
    }

    const isLoadingComplete = useCachedResources();
    const colorScheme = 'dark';

    if (!isLoadingComplete) {
    return null;
    } else {
    return (
        <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
        </SafeAreaProvider>
    );
    }
}

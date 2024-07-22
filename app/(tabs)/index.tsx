import React from 'react';
import { View, Text, Button } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Chat from '../chat';

type RootStackParamList = {
    Home: undefined;
    Chat: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

const Stack = createStackNavigator<RootStackParamList>();

const HomeScreen = ({ navigation }: Props) => {
    return (
        <View>
            <Text>Home Screen</Text>
            <Button title="Go to Chat" onPress={() => navigation.navigate('Chat')} />
        </View>
    );
};

export default function App() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

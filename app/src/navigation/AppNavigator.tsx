
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import TouchMapConfiguration from '../screens/games/TouchMapConfiguration';
import SixSecondKiss from "../screens/games/SixSecondKiss";
import AchievementsScreen from "../screens/dashboard/AchievementsScreen";
import AdmirationAim from "../screens/games/AdmirationAim";
import AmazingRaceCrossroads from "../screens/games/AmazingRaceCrossroads";
import AntidoteArena from "../screens/games/AntidoteArena";
import AdminUserManagementList from "../screens/admin/AdminUserManagementList";
import CategorySelectionScreen from "../screens/CategorySelectionScreen";
import CoupleLinking1 from "../screens/CoupleLinking1";
import CoupleLinking2 from "../screens/CoupleLinking2";
import CrisisResources from "../screens/CrisisResources";
import GameLibraryGridView from "../screens/GameLibraryGridView";
import TouchMapLiteGame from "../screens/games/TouchMapLiteGame";
import TouchMapPreferenceGame1 from "../screens/games/TouchMapPreferenceGame1";
import TouchMapPreferenceGame2 from "../screens/games/TouchMapPreferenceGame2";
import TranslationReveal from "../screens/TranslationReveal";
import TranslatorActionPlan from "../screens/TranslatorActionPlan";
import TranslatorActionPlan9 from "../screens/TranslatorActionPlan9";
import TranslatorActionPlan10 from "../screens/TranslatorActionPlan10";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="GameLibraryGridView" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="TouchMapConfiguration" component={TouchMapConfiguration} />
                <Stack.Screen name="SixSecondKiss" component={SixSecondKiss} />
                <Stack.Screen name="Achievements" component={AchievementsScreen} />
                <Stack.Screen name="AdmirationAim" component={AdmirationAim} />
                <Stack.Screen name="AmazingRaceCrossroads" component={AmazingRaceCrossroads} />
                <Stack.Screen name="AntidoteArena" component={AntidoteArena} />
                <Stack.Screen name="AdminUserManagementList" component={AdminUserManagementList} />
                <Stack.Screen name="CategorySelectionScreen" component={CategorySelectionScreen} />
                <Stack.Screen name="CoupleLinking1" component={CoupleLinking1} />
                <Stack.Screen name="CoupleLinking2" component={CoupleLinking2} />
                <Stack.Screen name="CrisisResources" component={CrisisResources} />
                <Stack.Screen name="GameLibraryGridView" component={GameLibraryGridView} />
                <Stack.Screen name="TouchMapLiteGame" component={TouchMapLiteGame} />
                <Stack.Screen name="TouchMapPreferenceGame1" component={TouchMapPreferenceGame1} />
                <Stack.Screen name="TouchMapPreferenceGame2" component={TouchMapPreferenceGame2} />
                <Stack.Screen name="TranslationReveal" component={TranslationReveal} />
                <Stack.Screen name="TranslatorActionPlan" component={TranslatorActionPlan} />
                <Stack.Screen name="TranslatorActionPlan9" component={TranslatorActionPlan9} />
                <Stack.Screen name="TranslatorActionPlan10" component={TranslatorActionPlan10} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

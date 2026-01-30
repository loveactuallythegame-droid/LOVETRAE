
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminLoginScreen from './AdminLoginScreen';
import AdminDashboard from './AdminDashboard';
import AdminGameCMSListView from './AdminGameCMSListView';
import AdminGameEditorScreen from './AdminGameEditorScreen';
import AdminFightModerationQueue from './AdminFightModerationQueue';
import AdminUserManagement from './AdminUserManagement';
import AdminGlobalConfig from './AdminGlobalConfig';
import AdminPushComposer from './AdminPushComposer';

const AdminStack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboard} />
      <AdminStack.Screen name="AdminGameCMS" component={AdminGameCMSListView} />
      <AdminStack.Screen name="AdminGameEditor" component={AdminGameEditorScreen} />
      <AdminStack.Screen name="AdminSOS" component={AdminFightModerationQueue} />
      <AdminStack.Screen name="AdminUserManagement" component={AdminUserManagement} />
      <AdminStack.Screen name="AdminGlobalConfig" component={AdminGlobalConfig} />
      <AdminStack.Screen name="AdminPushComposer" component={AdminPushComposer} />
    </AdminStack.Navigator>
  );
};

export default AdminNavigator;

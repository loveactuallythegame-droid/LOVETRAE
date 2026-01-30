
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../../state/store';
import { auth } from '../../firebase/firebaseConfig';

const AdminDashboard = () => {
  const navigation = useNavigation();
  const setAdmin = useAppStore((s) => s.setAdmin);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setAdmin(false);
    });
  };

  const menuItems = [
    { title: 'Game Content CMS', screen: 'AdminGameCMSListView', icon: '🎮' },
    { title: 'SOS Fight Queue', screen: 'AdminFightModerationQueue', icon: '⚔️' },
    { title: 'User Management', screen: 'AdminUserManagement', icon: '👥' },
    { title: 'Global AI Config', screen: 'AdminGlobalConfig', icon: '⚙️' },
    { title: 'Push Notification Composer', screen: 'AdminPushComposer', icon: '📬' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/mainlogoone.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Puppet Master Portal</Text>
      <ScrollView contentContainerStyle={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5C1459', // Glam Noir
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 36,
    fontFamily: 'BarbieDream-Regular',
    color: '#FA1F63', // Hot Pink
    textAlign: 'center',
    marginBottom: 30,
  },
  menuContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  menuItem: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(250, 31, 99, 0.3)',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 20,
  },
  menuText: {
    fontSize: 18,
    fontFamily: 'SweetPink-Regular',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#33DEA5', // Teal
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdminDashboard;


import React, { useState } from 'react';
import { 
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ImageBackground, TextInput 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const games = [
    { id: '1', title: 'Soul Sync', category: 'Communication', time: 15, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWIpTHvb05jkwBvDxLVC32Q-AfzgqzPLS2wjwxJ86AJ-098JAoe8owi90_hmkH39qpdXIWYtYzLTE1_xaK5Wk_JVvrE37V-WggccbdwBL1jCMF5Hrq696sJ4XGKtdeR78O_HaSFX4T9sX8OuhSbEEpXvSWd7cVSqbcAqPaJ3tfloepDNAJ4rAeiJU7HOC4E8YLmMfhjZEbemNYE7Gqzs_7X2Wx3uv2WHUnX3pU8Xk9AEf4jqD4dG2ih0leRzHov1rMMlVCc-yVnC90', status: 'New' },
    { id: '2', title: 'Cosmic Connection', category: 'Intimacy', time: 10, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpd_b1gTPxoDK-tDQKVifQtuIZUHspSoyckTrGw0RUG_v3gQbjhzNITRKH0l68PB3g8quKu2utRM0EJF4J2X2tf_K5dtBM82ys7A184UURoytubqr_hfS6p3xj0bzXIxNmTkPVejJ7WbKtWh8Z-9-RoRkg-eVXBNfqNDGHDajGW9DrFK9ymv_sh_oTVFJfKHT2ks6O1tovbM-u3nThk6RDyvSUcxyjbwbcdwih49-u-iu7Cn5npuVrQhFmPv8i999yCQ9cuo8ed3a4', status: 'Completed' },
    { id: '3', title: 'Deep Dive', category: 'Future Goals', time: 25, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3z8bew-VvClVTDBL3ISYmzaMwyf3Jwz2C7y2NkUUSGwgiVasaryfFh_JEmaUnhgps9YLlnj5H7v8gkF5-8upWQc35K8Y2rTjmUrLnKeLuMb6-tLiqzNFt8-U4IdsQE6BmgwRxIr800buTe5lKww89pzYytj1bRKVUtPYqpgtvfEyq0yiGeA0vfFbc0k-Vzy24u2zbuTiNbjdqZnB4Uj345_gH02v2TZlpYMwoD5GKQ7iMJe6PL0obBLTv3VS2dJyc0-IVx35bIDXZ', status: null },
    { id: '4', title: 'Stellar Stories', category: 'Fun', time: 12, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8m89dc6KszMvEOMF1EFGuxixzOdDNR4H7zm8ubHNVJevIAogZVKznhmPI7hUClZcsK8tlnBO9M5Uxen8aEiAFMvnO2A0Lou9zh5Oqsu1cTH6ksfXkUPAqYg4bJG5xpMMlb11VbdftmQvTAQ8j9gcBV1M5BTIjlowycWgcKfu5UmQIVAUU-en8d-GWWPPJk6gaePXkmKN-XmxreaGVWe6aj3XQDb5L-xkzDYSUUFLm7lvYDs2Lz4PvjoBuJrpAZap6zSV1eSMtv1wR', status: 'New' },
];

const GameCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
        <ImageBackground source={{ uri: item.image }} style={styles.cardImage} imageStyle={{ borderRadius: 20 }}>
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.imageOverlay} />
            {item.status && (
                <View style={[styles.statusBadge, item.status === 'New' ? styles.newBadge : styles.completedBadge]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            )}
             <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title.toUpperCase()}</Text>
                <Text style={styles.cardInfo}>{item.time} MINS • {item.category.toUpperCase()}</Text>
            </View>
        </ImageBackground>
    </TouchableOpacity>
);

const GameLibraryScreen = () => {
    const [activeTab, setActiveTab] = useState('All');

    const renderTab = (tabName) => (
        <TouchableOpacity onPress={() => setActiveTab(tabName)} style={[styles.tab, activeTab === tabName && styles.activeTab]}>
            <Text style={styles.tabText}>{tabName.toUpperCase()}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <View style={styles.header}>
                    <TextInput placeholder="FIND A MINI-GAME..." placeholderTextColor="rgba(255,255,255,0.4)" style={styles.searchInput}/>
                </View>
                <View style={styles.tabs}>
                    {renderTab('All')}
                    {renderTab('Communication')}
                    {renderTab('Intimacy')}
                </View>
                <FlatList
                    data={games}
                    renderItem={GameCard}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingTop: 16 },
    searchInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    tabs: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
    tab: { paddingVertical: 8, paddingHorizontal: 12 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#FF4081' },
    tabText: { color: '#D1C4E9', fontWeight: 'bold', textTransform: 'uppercase' },
    grid: { paddingHorizontal: 8 },
    card: {
        flex: 1,
        margin: 8,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)'
    },
    cardImage: { height: 200, justifyContent: 'flex-end' },
    imageOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 20 },
    cardContent: { padding: 12 },
    cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' },
    cardInfo: { color: '#D1C4E9', fontSize: 10, marginTop: 4, textTransform: 'uppercase' },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15
    },
    newBadge: { backgroundColor: '#FFD700' },
    completedBadge: { backgroundColor: '#FF4081' },
    statusText: { color: '#000', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
});

export default GameLibraryScreen;


import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const AntidoteCard = ({ name, description, effect, color }: any) => (
    <View style={[styles.antidoteCard, { borderColor: color }]}>
        <Text style={[styles.antidoteName, { color: color }]}>{name}</Text>
        <Text style={styles.antidoteDescription}>{description}</Text>
        <Text style={styles.antidoteEffect}>{effect}</Text>
    </View>
);

const GameNode = ({ type, title, subtitle, color, isCurrent }: any) => (
    <View style={styles.nodeContainer}>
        <View style={[styles.nodeIcon, { backgroundColor: `${color}20`, borderColor: color }, isCurrent && styles.currentNodeIcon]}>
             {isCurrent ? <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGhRsraipFZhqqSH-91yEjVqjtkysAnF6g9bojd-2VYt6U-1fXEa6i8RHsTzu1UBuG3qtNKYgH8ynKH7B7mfChtT_UugqnJjcY0am1HRyYUJT1TZBr664q9ejEI17_OZIbr_dw8ou8c_kKHS3PTY3l-x8i6AzD1szhKkookc6aQgepcSkQaYRB4ypkVPZb5STfLPIQZSZVZlrN2XgXY230WkVUNrsDJ-qM-U-shBYdZpOw9HPbaPBA1i26h8xeKwhgzDj67qGnUEZi'}} style={styles.playerAvatar} /> : <Text>!</Text>}
        </View>
        <View style={styles.nodeLine} />
        <View style={styles.nodeTextContainer}>
            <Text style={styles.nodeTitle}>{title}</Text>
            <Text style={styles.nodeSubtitle}>{subtitle}</Text>
        </View>
    </View>
);

const CycleBreakerBoardGameScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#101622', '#1a1e26']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainLayout}>
                    <View style={styles.leftSidebar}>
                         <View style={styles.glassPanel}>
                             <Text style={styles.sidebarTitle}>Dr. Marcie's Advice</Text>
                             <Text style={styles.sidebarText}>"Notice the tension rising. Your partner's silence is a defensive trigger..."</Text>
                             <TouchableOpacity style={styles.rollButton}><Text style={styles.rollButtonText}>ROLL DICE</Text></TouchableOpacity>
                         </View>
                    </View>

                    <View style={styles.centerContent}>
                        <View style={[styles.glassPanel, styles.statusHeader]}>
                            <Text style={styles.statusTitle}>Phase 2: Trust Renovation</Text>
                            <Text style={styles.statusSubtitle}>Progress: 65%</Text>
                        </View>

                        <View style={styles.gameBoard}>
                           <GameNode type="trigger" title="Misunderstanding" subtitle="Node 12" color="#ef4444" isCurrent={false} />
                           <GameNode type="response" title="Active Listening" subtitle="Node 13" color="#ff005e" isCurrent={false} />
                           <GameNode type="trigger" title="Past Trauma Loop" subtitle="Node 14" color="#eab308" isCurrent={true} />
                        </View>
                        
                         <View style={styles.antidoteHand}>
                            <AntidoteCard name="Transparency" description="Share a hidden truth." effect="+12 Trust" color="#22d3ee" />
                            <AntidoteCard name="Vulnerability" description="Open up to bypass defenses." effect="+20 Bond" color="#ec4899" />
                            <AntidoteCard name="Reflection" description="Pause the loop for 1 turn." effect="Break Node" color="#4ade80" />
                            <AntidoteCard name="Boundaries" description="Establish safety node." effect="+15 Safety" color="#f59e0b" />
                        </View>
                    </View>

                    <View style={styles.rightSidebar}>
                         <View style={styles.glassPanel}>
                            <Text style={styles.sidebarTitle}>Connection Stats</Text>
                             {/* Add stats bars here */}
                         </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#101622' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { flexGrow: 1, padding: 10 },
    mainLayout: { flexDirection: 'row' },
    leftSidebar: { width: 200, marginRight: 10 },
    centerContent: { flex: 1, marginRight: 10 },
    rightSidebar: { width: 200 },
    glassPanel: { backgroundColor: 'rgba(26,30,38,0.4)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 10 },
    sidebarTitle: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', textTransform: 'uppercase', fontSize: 14, marginBottom: 10 },
    sidebarText: { fontFamily: 'SweetPink-Regular', color: '#9da6b9', fontSize: 12, fontStyle: 'italic' },
    rollButton: { backgroundColor: '#ff005e', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 },
    rollButtonText: { fontFamily: 'BarbieDream-Regular', color: '#FFF', fontSize: 16 },
    statusHeader: { alignItems: 'center' },
    statusTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 22, color: '#FFF' },
    statusSubtitle: { fontFamily: 'SweetPink-Regular', color: '#9da6b9', fontSize: 14 },
    gameBoard: { flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20 },
    nodeContainer: { alignItems: 'center', marginVertical: 10 },
    nodeIcon: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    currentNodeIcon: { borderWidth: 3, borderColor: '#ff005e' },
    playerAvatar: { width: 40, height: 40, borderRadius: 20 },
    nodeLine: { width: 2, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
    nodeTextContainer: { alignItems: 'center' },
    nodeTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 16, color: '#FFF' },
    nodeSubtitle: { fontFamily: 'SweetPink-Regular', color: '#9da6b9', fontSize: 12 },
    antidoteHand: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
    antidoteCard: { width: 80, height: 110, backgroundColor: '#1a1e26', borderRadius: 8, borderWidth: 1, padding: 5, justifyContent: 'space-between', alignItems: 'center' },
    antidoteName: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 10, textTransform: 'uppercase' },
    antidoteDescription: { fontFamily: 'SweetPink-Regular', fontSize: 8, color: '#9da6b9', textAlign: 'center' },
    antidoteEffect: { fontFamily: 'BarbieDream-Regular', fontSize: 10, color: '#FFF' },
});

export default CycleBreakerBoardGameScreen;

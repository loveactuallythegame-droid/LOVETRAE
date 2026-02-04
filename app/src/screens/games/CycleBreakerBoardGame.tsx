import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const AntidoteCard = ({ name, description, effect, color }: any) => (
    <LinearGradient
        colors={['#db147c', '#f05d68']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.antidoteCard, { borderColor: color }]}
    >
        <Text style={[styles.antidoteName, { color: '#ffffff' }]}>{name}</Text>
        <Text style={styles.antidoteDescription}>{description}</Text>
        <Text style={styles.antidoteEffect}>{effect}</Text>
    </LinearGradient>
);

const GameNode = ({ type, title, subtitle, color, isCurrent }: any) => (
    <View style={styles.nodeContainer}>
        <LinearGradient
            colors={['#a22ac4', '#9056ef']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.nodeIcon, { borderColor: color }, isCurrent && styles.currentNodeIcon]}
        >
            {isCurrent ? <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGhRsraipFZhqqSH-91yEjVqjtkysAnF6g9bojd-2VYt6U-1fXEa6i8RHsTzu1UBuG3qtNKYgH8ynKH7B7mfChtT_UugqnJjcY0am1HRyYUJT1TZBr664q9ejEI17_OZIbr_dw8ou8c_kKHS3PTY3l-x8i6AzD1szhKkookc6aQgepcSkQaYRB4ypkVPZb5STfLPIQZSZVZlrN2XgXY230WkVUNrsDJ-qM-U-shBYdZpOw9HPbaPBA1i26h8xeKwhgzDj67qGnUEZi'}} style={styles.playerAvatar} /> : <Text style={{ color: '#ffffff' }}>!</Text>}
        </LinearGradient>
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
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>Break free from destructive cycles! Identify triggers and rewrite reactions.</Text>
                </View>
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainLayout}>
                    <LinearGradient
                        colors={['#37cf97', '#b37dec']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.leftSidebar}
                    >
                         <LinearGradient
                            colors={['#a22ac4', '#9056ef']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.glassPanel}
                         >
                             <Text style={styles.sidebarTitle}>Dr. Marcie's Advice</Text>
                             <Text style={styles.sidebarText}>"Notice the tension rising. Your partner's silence is a defensive trigger..."</Text>
                             <TouchableOpacity style={styles.rollButton}>
                                <LinearGradient
                                    colors={['#ffffff', '#ffffff']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.rollButtonText}>ROLL DICE</Text>
                                </LinearGradient>
                             </TouchableOpacity>
                         </LinearGradient>
                    </LinearGradient>

                    <View style={styles.centerContent}>
                        <LinearGradient
                            colors={['#ff7600', '#ffef1f']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.glassPanel, styles.statusHeader]}
                        >
                            <Text style={styles.statusTitle}>Phase 2: Trust Renovation</Text>
                            <Text style={styles.statusSubtitle}>Progress: 65%</Text>
                        </LinearGradient>

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

                    <LinearGradient
                        colors={['#db147c', '#f05d68']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.rightSidebar}
                    >
                         <LinearGradient
                            colors={['#a22ac4', '#9056ef']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.glassPanel}
                         >
                            <Text style={styles.sidebarTitle}>Connection Stats</Text>
                             {/* Add stats bars here */}
                         </LinearGradient>
                    </LinearGradient>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#101622' },
    background: { ...StyleSheet.absoluteFillObject },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        margin: 16,
        marginBottom: 8
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fcc738',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: 12,
        padding: 12
    },
    quoteText: {
        color: '#ffffff',
        fontSize: 14,
        lineHeight: 20
    },
    scrollContainer: { flexGrow: 1, padding: 10 },
    mainLayout: { flexDirection: 'row' },
    leftSidebar: { 
        width: 200, 
        marginRight: 10,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    centerContent: { flex: 1, marginRight: 10 },
    rightSidebar: { 
        width: 200,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    glassPanel: { 
        borderRadius: 16, 
        padding: 15, 
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    sidebarTitle: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        color: '#ffffff', 
        textTransform: 'uppercase', 
        fontSize: 14, 
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    sidebarText: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontSize: 12, 
        fontStyle: 'italic',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        borderRadius: 8,
    },
    rollButton: { 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 12,
    },
    rollButtonText: { 
        fontFamily: 'BarbieDream-Regular', 
        color: '#db147c', 
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusHeader: { 
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    statusTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 22, 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusSubtitle: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontSize: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    gameBoard: { flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20 },
    nodeContainer: { alignItems: 'center', marginVertical: 10 },
    nodeIcon: { 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        borderWidth: 2, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    currentNodeIcon: { borderWidth: 3, borderColor: '#db147c' },
    playerAvatar: { width: 40, height: 40, borderRadius: 20 },
    nodeLine: { width: 2, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
    nodeTextContainer: { alignItems: 'center' },
    nodeTitle: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 16, 
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    nodeSubtitle: { 
        fontFamily: 'SweetPink-Regular', 
        color: '#ffffff', 
        fontSize: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    antidoteHand: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
    antidoteCard: { 
        width: 80, 
        height: 110, 
        borderRadius: 8, 
        borderWidth: 2,
        padding: 5, 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    antidoteName: { 
        fontFamily: 'WonderfulSometimes-Regular', 
        fontSize: 10, 
        textTransform: 'uppercase',
        color: '#ffffff',
    },
    antidoteDescription: { 
        fontFamily: 'SweetPink-Regular', 
        fontSize: 8, 
        color: '#ffffff', 
        textAlign: 'center',
    },
    antidoteEffect: { 
        fontFamily: 'BarbieDream-Regular', 
        fontSize: 10, 
        color: '#ffffff',
    },
});

export default CycleBreakerBoardGameScreen;
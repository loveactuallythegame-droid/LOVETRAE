import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, GlassCard, Text, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const AntidoteCard = ({ name, description, effect, color }: any) => (
    <LinearGradient
        colors={GRADIENTS.primary.colors}
        start={GRADIENTS.primary.start}
        end={GRADIENTS.primary.end}
        style={[styles.antidoteCard, { borderColor: color }]}
    >
        <Text variant="caption" style={styles.antidoteName}>{name}</Text>
        <Text variant="small" style={styles.antidoteDescription}>{description}</Text>
        <Text variant="caption" style={styles.antidoteEffect}>{effect}</Text>
    </LinearGradient>
);

const GameNode = ({ type, title, subtitle, color, isCurrent }: any) => (
    <View style={styles.nodeContainer}>
        <LinearGradient
            colors={[COLORS.lavenderPurple, COLORS.softViolet]}
            start={GRADIENTS.primary.start}
            end={GRADIENTS.primary.end}
            style={[styles.nodeIcon, { borderColor: color }, isCurrent && styles.currentNodeIcon]}
        >
            {isCurrent ? <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGhRsraipFZhqqSH-91yEjVqjtkysAnF6g9bojd-2VYt6U-1fXEa6i8RHsTzu1UBuG3qtNKYgH8ynKH7B7mfChtT_UugqnJjcY0am1HRyYUJT1TZBr664q9ejEI17_OZIbr_dw8ou8c_kKHS3PTY3l-x8i6AzD1szhKkookc6aQgepcSkQaYRB4ypkVPZb5STfLPIQZSZVZlrN2XgXY230WkVUNrsDJ-qM-U-shBYdZpOw9HPbaPBA1i26h8xeKwhgzDj67qGnUEZi'}} style={styles.playerAvatar} /> : <Text variant="h2" style={{ color: COLORS.textPrimary }}>!</Text>}
        </LinearGradient>
        <View style={styles.nodeLine} />
        <View style={styles.nodeTextContainer}>
            <Text variant="body" style={styles.nodeTitle}>{title}</Text>
            <Text variant="caption" style={styles.nodeSubtitle}>{subtitle}</Text>
        </View>
    </View>
);

const CycleBreakerBoardGameScreen = () => {

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Text variant="sass">Break free from destructive cycles! Identify triggers and rewrite reactions.</Text>
                </View>
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainLayout}>
                    <LinearGradient
                        colors={[COLORS.mintGreen, COLORS.softViolet]}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.leftSidebar}
                    >
                         <LinearGradient
                            colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                            start={GRADIENTS.primary.start}
                            end={GRADIENTS.primary.end}
                            style={styles.glassPanel}
                         >
                             <Text variant="h2" style={styles.sidebarTitle}>Dr. Marcie's Advice</Text>
                             <Text variant="body" style={styles.sidebarText}>"Notice the tension rising. Your partner's silence is a defensive trigger..."</Text>
                             <SquishyButton style={styles.rollButton}>
                                <Text variant="button" style={{ color: COLORS.vibrantPink }}>ROLL DICE</Text>
                             </SquishyButton>
                         </LinearGradient>
                    </LinearGradient>

                    <View style={styles.centerContent}>
                        <LinearGradient
                            colors={[COLORS.warmOrange, COLORS.brightYellow]}
                            start={GRADIENTS.primary.start}
                            end={GRADIENTS.primary.end}
                            style={[styles.glassPanel, styles.statusHeader]}
                        >
                            <Text variant="h2" style={styles.statusTitle}>Phase 2: Trust Renovation</Text>
                            <Text variant="body" style={styles.statusSubtitle}>Progress: 65%</Text>
                        </LinearGradient>

                        <View style={styles.gameBoard}>
                           <GameNode type="trigger" title="Misunderstanding" subtitle="Node 12" color={COLORS.error} isCurrent={false} />
                           <GameNode type="response" title="Active Listening" subtitle="Node 13" color={COLORS.vibrantPink} isCurrent={false} />
                           <GameNode type="trigger" title="Past Trauma Loop" subtitle="Node 14" color={COLORS.warning} isCurrent={true} />
                        </View>
                        
                         <View style={styles.antidoteHand}>
                            <AntidoteCard name="Transparency" description="Share a hidden truth." effect="+12 Trust" color={COLORS.info} />
                            <AntidoteCard name="Vulnerability" description="Open up to bypass defenses." effect="+20 Bond" color={COLORS.rosePink} />
                            <AntidoteCard name="Reflection" description="Pause the loop for 1 turn." effect="Break Node" color={COLORS.success} />
                            <AntidoteCard name="Boundaries" description="Establish safety node." effect="+15 Safety" color={COLORS.warning} />
                        </View>
                    </View>

                    <LinearGradient
                        colors={GRADIENTS.primary.colors}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.rightSidebar}
                    >
                         <LinearGradient
                            colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                            start={GRADIENTS.primary.start}
                            end={GRADIENTS.primary.end}
                            style={styles.glassPanel}
                         >
                            <Text variant="h2" style={styles.sidebarTitle}>Connection Stats</Text>
                             {/* Add stats bars here */}
                         </LinearGradient>
                    </LinearGradient>
                </View>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.backgroundPrimary },
    background: { ...StyleSheet.absoluteFillObject },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xxlarge,
        padding: SPACING.regular,
        margin: SPACING.regular,
        marginBottom: SPACING.small,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover',
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
    },
    scrollContainer: { flexGrow: 1, padding: SPACING.small },
    mainLayout: { flexDirection: 'row' },
    leftSidebar: { 
        width: 200, 
        marginRight: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    centerContent: { flex: 1, marginRight: SPACING.regular },
    rightSidebar: { 
        width: 200,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    glassPanel: { 
        borderRadius: BORDER_RADIUS.xlarge, 
        padding: SPACING.regular, 
        marginBottom: SPACING.regular,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    sidebarTitle: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase', 
        marginBottom: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    sidebarText: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    },
    rollButton: { 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.medium, 
        alignItems: 'center', 
        marginTop: SPACING.regular,
        ...SHADOWS.large,
    },
    statusHeader: { 
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    statusTitle: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.xxlarge,
    },
    statusSubtitle: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    gameBoard: { flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingVertical: SPACING.xlarge },
    nodeContainer: { alignItems: 'center', marginVertical: SPACING.regular },
    nodeIcon: { 
        width: 50, 
        height: 50, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 2, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    currentNodeIcon: { borderWidth: 3, borderColor: COLORS.vibrantPink },
    playerAvatar: { width: 40, height: 40, borderRadius: BORDER_RADIUS.round },
    nodeLine: { width: 2, height: 40, backgroundColor: COLORS.borderSubtle },
    nodeTextContainer: { alignItems: 'center' },
    nodeTitle: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    nodeSubtitle: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    antidoteHand: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: SPACING.regular },
    antidoteCard: { 
        width: 80, 
        height: 110, 
        borderRadius: BORDER_RADIUS.medium, 
        borderWidth: 2,
        padding: SPACING.small, 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    antidoteName: { 
        textTransform: 'uppercase',
        color: COLORS.textPrimary,
    },
    antidoteDescription: { 
        color: COLORS.textPrimary, 
        textAlign: 'center',
    },
    antidoteEffect: { 
        color: COLORS.textPrimary,
    },
});

export default CycleBreakerBoardGameScreen;

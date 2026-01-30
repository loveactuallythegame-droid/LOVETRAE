
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const ResourceCard = ({ title, description, contact, contactType, imageUrl, color } : any) => (
    <View style={styles.glassPanel}>
        <Image source={{ uri: imageUrl }} style={styles.resourceImage} />
        <Text style={styles.resourceTitle}>{title}</Text>
        <Text style={styles.resourceDescription}>{description}</Text>
        <View style={styles.resourceFooter}>
            <Text style={{color: color, fontWeight: 'bold'}}>{contact}</Text>
            <TouchableOpacity style={[styles.contactButton, {backgroundColor: color}]}>
                <Text style={styles.contactButtonText}>{contactType}</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const CrisisResourcesScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#102222', '#1a2a2a']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                 <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Immediate Help</Text>
                    <Text style={styles.headerSubtitle}>If you or your partner are in immediate danger, please use these verified resources. Your safety is the priority.</Text>
                </View>

                <View style={styles.mainLayout}>
                    {/* Sidebar */}
                    <View style={styles.sidebar}>
                         <View style={styles.glassPanel}>
                            <Text style={styles.sidebarTitle}>Crisis Support</Text>
                            <TouchableOpacity style={styles.sidebarLink}><Text style={styles.sidebarLinkText}>Safety Plan</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.sidebarLink, styles.activeSidebarLink]}><Text style={styles.sidebarLinkText}>National Hotlines</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.sidebarLink}><Text style={styles.sidebarLinkText}>Chat Services</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.sidebarLink}><Text style={styles.sidebarLinkText}>Local Support</Text></TouchableOpacity>
                             <TouchableOpacity style={styles.safetyExitButton}><Text style={styles.safetyExitText}>SAFETY EXIT</Text></TouchableOpacity>
                        </View>
                    </View>

                    {/* Main Content */}
                    <View style={styles.mainContent}>
                        <TouchableOpacity style={styles.featuredResource}>
                            <View>
                                <Text style={styles.featuredTitle}>988 Suicide & Crisis Lifeline</Text>
                                <Text style={styles.featuredDescription}>Free, confidential support available 24/7.</Text>
                            </View>
                            <LinearGradient colors={['#fc0c84', '#4facfe']} style={styles.featuredButton}><Text style={styles.featuredButtonText}>Call 988</Text></LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.resourcesGrid}>
                            <ResourceCard 
                                title="Domestic Violence Hotline"
                                description="Safety planning and crisis intervention."
                                contact="1-800-799-7233"
                                contactType="Call Now"
                                imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDsU2YECQ_4xI_eT50V9TCCRu9IbGGrkozLV2C3b_IxsouJqSZfnFNFncZSQvZRp2IUZL3Y_fiHjKGSX9BVuKClxR0R63BqxEjBKCNgy3pEAWLazqlhlzPpuP4hkaPAOSWUg4fRtmbRYRF7AQXYHFQwtZbequn64S9mp4kyWvMS3AqaYYUNo5Yhwy6uXwnRWgnEGvOFiPShWvJrtyoU4jqsUkuxi-12JdyXMN2zbUjB8JknvPOypq9sMfuL8N_1LDylC2K3N5wSY70W"
                                color="#fc0c84"
                            />
                            <ResourceCard 
                                title="Crisis Text Line"
                                description="Connect with a volunteer Crisis Counselor."
                                contact="Text HOME to 741741"
                                contactType="Text Now"
                                imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBEZghUEoBL6tBgPFhkJGXTa8ArMz5-yypEuA3OI5ZSeZO3wMXuV40OKF7VyxdID-sEGcwJDl4TbVrDvBhCy0Tv5lagRelPkinkr4HKzWHzxEAoPf41PwezYCsXoNCZyVD_WjwcUnd9KX4Z1CcBtahflqNTe-lb3Mc1z0jxnwkPm9G6PYsggMhnMVcKB6tIFY9gIO9z9P62eOHMaDFHqH4rJY3OI7zrHtjdpROUOPbiqMFNeqRr-t8WXnUTyNFQt1R5k9jSaKykSAmG"
                                color="#d8b4fe"
                            />
                        </View>

                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 20 },
    headerContainer: { alignItems: 'center', marginBottom: 20, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(157, 185, 185, 0.2)', paddingBottom: 20 },
    headerTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 36, color: '#FFF' },
    headerSubtitle: { fontFamily: 'SweetPink-Regular', fontSize: 16, color: '#9db9b9', textAlign: 'center' },
    mainLayout: { flexDirection: 'row', marginTop: 15 },
    sidebar: { width: 220, marginRight: 20 },
    mainContent: { flex: 1 },
    glassPanel: { backgroundColor: 'rgba(26, 42, 42, 0.8)', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: 'rgba(157, 185, 185, 0.1)', marginBottom: 15 },
    sidebarTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 18, color: '#FFF', marginBottom: 15 },
    sidebarLink: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8 },
    activeSidebarLink: { backgroundColor: 'rgba(252, 12, 132, 0.1)', borderColor: 'rgba(252, 12, 132, 0.2)', borderWidth: 1 },
    sidebarLinkText: { fontFamily: 'SweetPink-Regular', color: '#FFF', fontSize: 14 },
    safetyExitButton: { marginTop: 10, backgroundColor: 'rgba(255, 0, 0, 0.1)', borderColor: 'rgba(255, 0, 0, 0.3)', borderWidth: 1, borderRadius: 8, padding: 12, alignItems: 'center' },
    safetyExitText: { fontFamily: 'BarbieDream-Regular', color: 'red', fontSize: 14 },
    featuredResource: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(252, 12, 132, 0.05)', padding: 20, borderRadius: 16, marginBottom: 15 },
    featuredTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#FFF' },
    featuredDescription: { fontFamily: 'SweetPink-Regular', color: '#9db9b9' },
    featuredButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
    featuredButtonText: { fontFamily: 'BarbieDream-Regular', color: '#102222', fontSize: 16 },
    resourcesGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    resourceImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 10 },
    resourceTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 18, color: '#FFF' },
    resourceDescription: { fontFamily: 'SweetPink-Regular', color: '#9db9b9', marginVertical: 5 },
    resourceFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
    contactButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
    contactButtonText: { color: '#102222', fontWeight: 'bold' },
});

export default CrisisResourcesScreen;

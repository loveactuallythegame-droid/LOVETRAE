
import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const ContactSupportScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#0a0f0f', '#230f19']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.headingContainer}>
                    <Text style={styles.headingTitle}>Need a hand, partner?</Text>
                    <Text style={styles.headingSubtitle}>Our support crew is ready to help you navigate your journey.</Text>
                </View>

                <View style={styles.glassPanel}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Subject</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Briefly describe your issue"
                            placeholderTextColor="rgba(157, 185, 185, 0.5)"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Category</Text>
                         <View style={styles.pickerContainer}>
                            <Text style={styles.pickerText}>Select a category</Text>
                            <Text style={styles.pickerIcon}>▼</Text>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Message</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Tell us more about what's happening..."
                            placeholderTextColor="rgba(157, 185, 185, 0.5)"
                            multiline
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton}>
                       <LinearGradient colors={['#13ecec', '#0e7e7e']} style={styles.submitButtonGradient}>
                           <Text style={styles.submitButtonText}>Submit Ticket</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.responseTimeIndicator}>
                         <Text style={styles.indicatorText}>Average Response Time: 2h</Text>
                    </View>
                </View>
                
                <View style={styles.footerLinks}>
                    <TouchableOpacity><Text style={styles.linkText}>Knowledge Base</Text></TouchableOpacity>
                    <TouchableOpacity><Text style={styles.linkText}>Community Forums</Text></TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    headingContainer: { alignItems: 'center', marginBottom: 30, paddingHorizontal: 10 },
    headingTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 36, color: '#FFF', textAlign: 'center', marginBottom: 10 },
    headingSubtitle: { fontFamily: 'SweetPink-Regular', fontSize: 16, color: '#9db9b9', textAlign: 'center', maxWidth: '80%' },
    glassPanel: {
        width: '100%',
        maxWidth: 640,
        backgroundColor: 'rgba(17, 24, 24, 0.85)',
        borderWidth: 1,
        borderColor: 'rgba(19, 236, 236, 0.1)',
        borderRadius: 16,
        padding: 25,
    },
    formGroup: { marginBottom: 20 },
    label: { fontFamily: 'WonderfulSometimes-Regular', color: '#FFF', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 },
    input: { 
        backgroundColor: 'rgba(40, 57, 57, 0.5)',
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 15,
        color: '#FFF',
        fontSize: 16,
    },
    textArea: { height: 120, paddingTop: 15, textAlignVertical: 'top' },
    pickerContainer: { 
        backgroundColor: 'rgba(40, 57, 57, 0.5)',
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pickerText: { color: 'rgba(157, 185, 185, 0.9)', fontSize: 16 },
    pickerIcon: { color: '#9db9b9' },
    submitButton: { marginTop: 10, height: 55, borderRadius: 12, overflow: 'hidden' },
    submitButtonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    submitButtonText: { color: '#0a0f0f', fontSize: 18, fontFamily: 'BarbieDream-Regular' },
    responseTimeIndicator: { alignSelf: 'center', backgroundColor: 'rgba(255, 140, 0, 0.1)', borderColor: 'rgba(255, 140, 0, 0.2)', borderWidth: 1, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, marginTop: 20 },
    indicatorText: { color: '#ff8c00', fontSize: 14, fontFamily: 'SweetPink-Regular' },
    footerLinks: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 30 },
    linkText: { color: '#9db9b9', fontSize: 14, fontFamily: 'SweetPink-Regular', textDecorationLine: 'underline' }
});

export default ContactSupportScreen;

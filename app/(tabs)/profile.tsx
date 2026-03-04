import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { Bell, CircleHelp, Settings, UserCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const menuItems = [
        { title: 'USTAWIENIA KONTA', icon: <UserCircle size={24} color={theme.icon} /> },
        { title: 'POWIADOMIENIA', icon: <Bell size={24} color={theme.icon} /> },
        { title: 'PREFERENCJE TRENINGU', icon: <Settings size={24} color={theme.icon} /> },
        { title: 'POMOC I WSPARCIE', icon: <CircleHelp size={24} color={theme.icon} /> },
    ];

    const handleMenuPress = () => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.Text entering={FadeInDown.duration(600)} style={[styles.title, { color: theme.text }]}>TWÓJ PROFIL</Animated.Text>

            <Animated.View entering={FadeInDown.delay(100).duration(600)} style={[styles.profileHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>S</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: theme.text }]}>SZYMON</Text>
                    <Text style={[styles.profileSubtitle, { color: theme.text, opacity: 0.6 }]}>POCZĄTKUJĄCY</Text>
                </View>
            </Animated.View>

            <Animated.Text entering={FadeInDown.delay(200)} style={[styles.sectionTitle, { color: theme.text }]}>KONTO</Animated.Text>

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={item.title}
                        onPress={handleMenuPress}
                        style={[
                            styles.menuItem,
                            index !== menuItems.length - 1 && { borderBottomWidth: 1.5, borderBottomColor: theme.border }
                        ]}
                    >
                        <View style={styles.menuItemIcon}>{item.icon}</View>
                        <Text style={[styles.menuItemText, { color: theme.text }]}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        marginBottom: 32,
        letterSpacing: -2,
        textTransform: 'uppercase',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 32,
        borderRadius: 32,
        borderWidth: 2,
        marginBottom: 40,
    },
    avatarPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#D9F845',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#09090B',
    },
    avatarText: {
        color: '#09090B',
        fontSize: 32,
        fontWeight: '900',
    },
    profileInfo: {
        marginLeft: 24,
    },
    profileName: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 4,
        letterSpacing: -1,
        textTransform: 'uppercase',
    },
    profileSubtitle: {
        fontSize: 16,
        fontWeight: '700',
        opacity: 0.7,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 20,
        marginLeft: 12,
        opacity: 0.6,
    },
    menuContainer: {
        borderRadius: 32,
        borderWidth: 2,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
    },
    menuItemIcon: {
        marginRight: 20,
    },
    menuItemText: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    }
});

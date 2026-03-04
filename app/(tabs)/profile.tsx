import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Bell, CircleHelp, Settings, UserCircle } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const menuItems = [
        { title: 'Ustawienia konta', icon: <UserCircle size={24} color={theme.icon} /> },
        { title: 'Powiadomienia', icon: <Bell size={24} color={theme.icon} /> },
        { title: 'Preferencje treningu', icon: <Settings size={24} color={theme.icon} /> },
        { title: 'Pomoc i wsparcie', icon: <CircleHelp size={24} color={theme.icon} /> },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Twój Profil</Text>

            <View style={[styles.profileHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>S</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: theme.text }]}>Szymon</Text>
                    <Text style={[styles.profileSubtitle, { color: theme.icon }]}>Początkujący</Text>
                </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Konto</Text>

            <View style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={item.title}
                        style={[
                            styles.menuItem,
                            index !== menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
                        ]}
                    >
                        <View style={styles.menuItemIcon}>{item.icon}</View>
                        <Text style={[styles.menuItemText, { color: theme.text }]}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
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
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 32,
        letterSpacing: -1,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 32,
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#D9F845', // Neon Volt accent color
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#09090B',
        fontSize: 28,
        fontWeight: '800',
    },
    profileInfo: {
        marginLeft: 20,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    profileSubtitle: {
        fontSize: 15,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
        marginLeft: 8,
    },
    menuContainer: {
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    menuItemIcon: {
        marginRight: 20,
    },
    menuItemText: {
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: -0.3,
    }
});

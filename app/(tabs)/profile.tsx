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
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 24,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 32,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '700',
    },
    profileInfo: {
        marginLeft: 16,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    profileSubtitle: {
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    menuContainer: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuItemIcon: {
        marginRight: 16,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
    }
});

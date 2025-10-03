import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title = "MoviStore" }) => {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigation.navigate('Login');
  };

  const getUserFirstName = () => {
    return user?.name?.split(' ')[0] || 'Usuario';
  };

  // ✅ Navegación CORREGIDA
  const navigateToCart = () => {
    try {
      // Intenta navegar directamente a 'Cart'
      navigation.navigate('Cart');
    } catch (error) {
      console.warn('No se puede navegar a Cart directamente, intentando método alternativo...');
      // Si falla, intenta navegar a través del Main navigator
      navigation.navigate('Main', { screen: 'Cart' });
    }
  };

  const navigateToProfile = () => {
    setIsDropdownOpen(false);
    try {
      navigation.navigate('Profile');
    } catch (error) {
      console.warn('Error navegando a Profile:', error);
      navigation.navigate('Main', { screen: 'Profile' });
    }
  };

  const navigateToOrderHistory = () => {
    setIsDropdownOpen(false);
    try {
      navigation.navigate('OrderHistory');
    } catch (error) {
      console.warn('Error navegando a OrderHistory:', error);
    }
  };

  const navigateToAdminDashboard = () => {
    setIsDropdownOpen(false);
    try {
      navigation.navigate('AdminMain');
    } catch (error) {
      console.warn('Error navegando a AdminDashboard:', error);
    }
  };

  // Para debugging - muestra en qué pantalla estamos
  React.useEffect(() => {
    console.log('🔍 Header montado - Usuario:', user?.name);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>{title}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={navigateToCart}
        >
          <Text style={styles.icon}>🛒</Text>
          {itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {itemCount > 9 ? '9+' : itemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {user ? (
          <TouchableOpacity 
            style={styles.userButton}
            onPress={() => setIsDropdownOpen(true)}
          >
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.userName}>{getUserFirstName()}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>Ingresar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal para el dropdown del usuario */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.dropdown}>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={navigateToProfile}
            >
              <Text style={styles.dropdownIcon}>👤</Text>
              <Text style={styles.dropdownText}>Mi Perfil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={navigateToOrderHistory}
            >
              <Text style={styles.dropdownIcon}>📦</Text>
              <Text style={styles.dropdownText}>Mis Pedidos</Text>
            </TouchableOpacity>
            
            {user?.role === 'admin' && (
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={navigateToAdminDashboard}
              >
                <Text style={styles.dropdownIcon}>⚙️</Text>
                <Text style={styles.dropdownText}>Panel Admin</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={[styles.dropdownItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <Text style={styles.dropdownIcon}>🚪</Text>
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Tus estilos se mantienen igual...
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 8,
  },
  icon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  loginButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
  },
  loginText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    alignSelf: 'flex-end',
    minWidth: 180,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dropdownIcon: {
    fontSize: 16,
    width: 20,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1C1C1E',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 4,
  },
  logoutItem: {
    // Estilos específicos para logout
  },
  logoutText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default Header;
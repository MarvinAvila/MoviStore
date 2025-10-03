import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const ProfileScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Perfil" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Debes iniciar sesión para ver tu perfil</Text>
        </View>
      </View>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  return (
    <View style={styles.container}>
      <Header title="Perfil" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header del perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.userDetails}>
              <Text style={styles.userDetail}>📧 {user.email}</Text>
              <Text style={styles.userDetail}>📅 Miembro desde {formatDate(user.created_at)}</Text>
            </View>
          </View>
        </View>

        {/* Navegación por pestañas */}
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
              👤 Información
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
            onPress={() => setActiveTab('orders')}
          >
            <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
              📦 Mis Pedidos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
            onPress={() => setActiveTab('settings')}
          >
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
              ⚙️ Configuración
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido de las pestañas */}
        <View style={styles.tabContent}>
          {activeTab === 'profile' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información Personal</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Nombre Completo</Text>
                  <Text style={styles.infoValue}>{user.name}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Correo Electrónico</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Rol</Text>
                  <Text style={styles.infoValue}>
                    {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'orders' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mis Pedidos</Text>
              <Text style={styles.sectionDescription}>
                Gestiona y revisa el estado de tus pedidos anteriores.
              </Text>
              <TouchableOpacity 
                style={styles.ordersButton}
                onPress={() => navigation.navigate('OrderHistory')}
              >
                <Text style={styles.ordersButtonText}>📦 Ver Historial Completo de Pedidos</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'settings' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Configuración de Cuenta</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Cambiar Contraseña</Text>
                  <Text style={styles.settingDescription}>
                    Actualiza tu contraseña regularmente para mantener tu cuenta segura.
                  </Text>
                </View>
                <TouchableOpacity style={styles.settingAction}>
                  <Text style={styles.settingActionText}>Cambiar</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Preferencias de Notificación</Text>
                  <Text style={styles.settingDescription}>
                    Gestiona cómo deseas recibir notificaciones sobre tus pedidos.
                  </Text>
                </View>
                <TouchableOpacity style={styles.settingAction}>
                  <Text style={styles.settingActionText}>Configurar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: '#007AFF',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  userDetails: {
    gap: 2,
  },
  userDetail: {
    fontSize: 14,
    color: '#6C6C70',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#6C6C70',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  tabContent: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6C6C70',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C6C70',
  },
  infoValue: {
    fontSize: 16,
    color: '#1C1C1E',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  ordersButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  ordersButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6C6C70',
    lineHeight: 18,
  },
  settingAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
  },
  settingActionText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#6C6C70',
    textAlign: 'center',
  },
});

export default ProfileScreen;
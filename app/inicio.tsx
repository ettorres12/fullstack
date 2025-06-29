import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;  
  urgent?: boolean;
}

const HomeScreen: React.FC = () => {
  const router = useRouter();  

  const cardData: CardData[] = [
    {
      id: '2',
      title: 'Consultas',
      subtitle: 'Agendar consultas',
      icon: 'calendar',
      color: '#FFD700',
      route: '/CadastroConsulta',
    },
    {
      id: '1',
      title: 'Lista de Consultas',
      subtitle: 'Listar consultas',
      icon: 'calendar',
      color: '#FFD700',
      route: '/RelatorioConsultas',
    },
    {
      id: '3',
      title: 'Lista de Pacientes',
      subtitle: 'Ver pacientes cadastrados',
      icon: 'people',
      color: '#4FC3F7',
      route: '/RelatorioPacientes',
    },
    {
      id: '8',
      title: 'Cadastro de Pacientes',
      subtitle: 'Cadastrar novos pacientes',
      icon: 'person',
      color: '#4FC3F7',
      route: '/CadastroPaciente',
    },
    {
      id: '9',
      title: 'Cadastro de Profissionais',
      subtitle: 'Cadastrar novos profissionais',
      icon: 'person',
      color: '#00796B',
      route: '/CadastroEmpregado',
    },
    {
      id: '6',
      title: 'Lista de Profissionais',
      subtitle: 'Listar profissionais cadastrados',
      icon: 'people',
      color: '#00796B',
      route: '/RelatorioEmpregados',
    }
  ];

  const handleCardPress = (route: string) => {
    router.push(route as any);  
  };

  const renderCard = (item: CardData) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, item.urgent && styles.urgentCard]}
      onPress={() => handleCardPress(item.route)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons 
          name={item.icon} 
          size={32} 
          color="white" 
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, item.urgent && styles.urgentText]}>
          {item.title}
        </Text>
        <Text style={styles.cardSubtitle}>
          {item.subtitle}
        </Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={24} 
        color="#BDC3C7" 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Bem-vindo ao</Text>
          <Text style={styles.systemName}>SCP - Sistema de Cadastro de Pacientes</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={40} color="white" />
        </TouchableOpacity>
      </View>

      {/* Status Cards */}
      <View style={styles.statusContainer}>
        <View style={styles.statusCard}>
          <Text style={styles.statusNumber}>24</Text>
          <Text style={styles.statusLabel}>Consultas Hoje</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusNumber}>156</Text>
          <Text style={styles.statusLabel}>Pacientes Ativos</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusNumber}>3</Text>
          <Text style={styles.statusLabel}>Emergências</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        
        <View style={styles.cardsContainer}>
          {cardData.map(renderCard)}
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          
          <View style={styles.activityItem}>
            <Ionicons name="checkmark-circle" size={24} color="#50C878" />
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>Consulta finalizada</Text>
              <Text style={styles.activitySubtitle}>Dr. Silva - há 15 min</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="add-circle" size={24} color="#4A90E2" />
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>Novo paciente cadastrado</Text>
              <Text style={styles.activitySubtitle}>Maria Santos - há 1h</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="document" size={24} color="#FF8C00" />
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>Exame disponível</Text>
              <Text style={styles.activitySubtitle}>João Oliveira - há 2h</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.8,
  },
  systemName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusCard: {
    flex: 1,
    alignItems: 'center',
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statusLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 25,
    marginBottom: 15,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    width: '30%',
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  urgentText: {
    color: '#FF4444',
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#7F8C8D',
    marginTop: 4,
  },
  recentActivity: {
    marginBottom: 30,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityText: {
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});

export default HomeScreen;

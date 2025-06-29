import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
  
export default function ListaPacientes() {
  const [Pacientes, setPacientes] = useState<any[]>([]);
  const [PacientesFiltrados, setPacientesFiltrados] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = 'https://scp-21qd.onrender.com/api/pacientes';

  const formatCPF = (cpf: any): string => {
    if (!cpf) return '';
    try {
      const cleanCPF = cpf.toString().replace(/\D/g, '');
      if (cleanCPF.length === 11) {
        return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
      return cpf.toString();
    } catch (error) {
      return '';
    }
  };

  const formatTelefone = (telefone: any): string => {
    if (!telefone) return '';
    try {
      const cleanTelefone = telefone.toString().replace(/\D/g, '');
      if (cleanTelefone.length === 11) {
        return cleanTelefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (cleanTelefone.length === 10) {
        return cleanTelefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
      return telefone.toString();
    } catch (error) {
      return '';
    }
  };

  const formatData = (dataISO: any): string => {
    if (!dataISO) return '';
    try {
      const date = new Date(dataISO);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return '';
    }
  };

  const carregarPacientes = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Garantir que data é um array
        const PacientesArray = Array.isArray(data) ? data : [];
        setPacientes(PacientesArray);
        setPacientesFiltrados(PacientesArray);
      } else {
        Alert.alert('Erro', 'Erro ao carregar Pacientes');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Erro de conexão. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarPacientes();
    setRefreshing(false);
  };

  const pesquisarPaciente = (texto: string) => {
    setSearchText(texto || '');
    
    if (!texto || !texto.trim()) {
      setPacientesFiltrados(Pacientes);
      return;
    }

    const filtrados = Pacientes.filter((Paciente: any) => {
      if (!Paciente) return false;
      
      const cartaoSUS = Paciente.cartaoSUS ? Paciente.cartaoSUS.toString().toLowerCase() : '';
      const nome = Paciente.nome ? Paciente.nome.toString().toLowerCase() : '';
      const textoBusca = texto.toLowerCase();
      
      return cartaoSUS.includes(textoBusca) || nome.includes(textoBusca);
    });
    
    setPacientesFiltrados(filtrados);
  };

  const limparPesquisa = () => {
    setSearchText('');
    setPacientesFiltrados(Pacientes);
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  const renderPaciente = (Paciente: any, index: number) => {
    if (!Paciente) return null;
    
    return (
      <View key={Paciente.id || index} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.nome}>{Paciente.nome || 'Nome não informado'}</Text>
          <Text style={styles.registro}>Cartão SUS: {Paciente.cartaoSUS || 'Não informado'}</Text>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>CPF:</Text>
            <Text style={styles.value}>{formatCPF(Paciente.cpf) || 'Não informado'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data de Nascimento:</Text>
            <Text style={styles.value}>{formatData(Paciente.dataNascimento) || 'Não informado'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Gênero:</Text>
            <Text style={styles.value}>{Paciente.genero || 'Não informado'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.value}>{formatTelefone(Paciente.telefone) || 'Não informado'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Vacinas:</Text>
            <Text style={styles.value}>{Paciente.Vacinas || 'Não informado'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Alergias:</Text>
            <Text style={styles.value}>{Paciente.alergias || 'Não informado'}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando Pacientes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pacientes Cadastrados</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={pesquisarPaciente}
          placeholder="Pesquisar por cartão SUS ou nome..."
          placeholderTextColor="#999"
        />
        {searchText !== '' && (
          <TouchableOpacity style={styles.clearButton} onPress={limparPesquisa}>
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.resultInfo}>
        <Text style={styles.resultText}>
          {PacientesFiltrados.length} Paciente(is) encontrado(s)
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
      >
        {PacientesFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchText ? 'Nenhum Paciente encontrado' : 'Nenhum Paciente cadastrado'}
            </Text>
          </View>
        ) : (
          PacientesFiltrados.map((Paciente, index) => 
            renderPaciente(Paciente, index)
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  resultInfo: {
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    backgroundColor: '#007AFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  registro: {
    fontSize: 14,
    color: '#E6F3FF',
  },
  cardBody: {
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
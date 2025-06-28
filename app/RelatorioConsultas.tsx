import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

export default function ListaConsultas() {
  const [Consultas, setConsultas] = useState<any[]>([]);
  const [ConsultasFiltrados, setConsultasFiltrados] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = 'https://scp-21qd.onrender.com/api/consultas';

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

  const carregarConsultas = async () => {
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
        const ConsultasArray = Array.isArray(data) ? data : [];
        setConsultas(ConsultasArray);
        setConsultasFiltrados(ConsultasArray);
      } else {
        Alert.alert('Erro', 'Erro ao carregar Consultas');
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
    await carregarConsultas();
    setRefreshing(false);
  };

  const pesquisarConsulta = (texto: string) => {
    setSearchText(texto || '');
    
    if (!texto || !texto.trim()) {
      setConsultasFiltrados(Consultas);
      return;
    }

    const filtrados = Consultas.filter((Consulta: any) => {
      if (!Consulta) return false;
      
      const registro = Consulta.registro ? Consulta.registro.toString().toLowerCase() : '';
      const nome = Consulta.nome ? Consulta.nome.toString().toLowerCase() : '';
      const textoBusca = texto.toLowerCase();
      
      return registro.includes(textoBusca) || nome.includes(textoBusca);
    });
    
    setConsultasFiltrados(filtrados);
  };

  const limparPesquisa = () => {
    setSearchText('');
    setConsultasFiltrados(Consultas);
  };

  useEffect(() => {
    carregarConsultas();
  }, []);

  const renderConsulta = (Consulta: any, index: number) => {
    if (!Consulta) return null;
    
    return (
      <View key={Consulta.id || index} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{Consulta.cartaoSUSConsulta || 'Não informado'}</Text>
          <Text style={styles.value}>Cartão SUS: {Consulta.cartaoSUSConsulta || 'Não informado'}</Text>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cartão SUS:</Text>
            <Text style={styles.value}>{Consulta.cartaoSUSConsulta || 'Não informado'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data da Consulta:</Text>
            <Text style={styles.value}>{formatData(Consulta.dataHora) || 'Não informado'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Registro Profissional:</Text>
            <Text style={styles.value}>{Consulta.cpfProfissional || 'Não informado'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Local da Consulta:</Text>
            <Text style={styles.value}>{Consulta.local || 'Não informado'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Motivo da Consulta:</Text>
            <Text style={styles.value}>{Consulta.motivoConsulta || 'Não informado'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Especialidade:</Text>
            <Text style={styles.value}>{Consulta.especialidadeConsulta || 'Não informado'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Observações:</Text>
            <Text style={styles.value}>{Consulta.observacoes || 'Não informado'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Diagnostico:</Text>
            <Text style={styles.value}>{Consulta.diagnosticoCondicao || 'Não informado'}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando Consultas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultas Cadastrados</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={pesquisarConsulta}
          placeholder="Pesquisar por registro ou nome..."
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
          {ConsultasFiltrados.length} Consulta(is) encontrado(s)
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
        {ConsultasFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchText ? 'Nenhum Consulta encontrado' : 'Nenhum Consulta cadastrado'}
            </Text>
          </View>
        ) : (
          ConsultasFiltrados.map((Consulta, index) => 
            renderConsulta(Consulta, index)
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
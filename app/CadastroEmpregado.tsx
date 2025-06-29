import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
  
export default function CadastroProfissional() {
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    registro: '',
    genero: '',
    telefone: '',
    funcao: '',
  });

  const [loading, setLoading] = useState(false);

  const API_URL = 'https://scp-21qd.onrender.com/api/empregados';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    
    
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return cleanValue.slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatTelefone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    }
    return cleanValue.slice(0, 11)
      .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatDataNascimento = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length <= 8) {
      return cleanValue
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
    }
    return cleanValue.slice(0, 8)
      .replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  };

  const convertDateToISO = (dateString: string) => {
    if (!dateString || dateString.length !== 10) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

const validateForm = () => {
    const requiredFields = ['nome', 'dataNascimento', 'cpf', 'genero', 'telefone', 'funcao'];
    
    
    if (formData.dataNascimento.length !== 10) {
      Alert.alert('Erro', 'Por favor, insira uma data de nascimento válida (DD/MM/AAAA)');
      return false;
    }

    return true;
  };


  const cadastrarProfissional = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepara os dados para envio
      const dataToSend = {
        ...formData,
        dataNascimento: convertDateToISO(formData.dataNascimento),
        cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação do CPF
        telefone: formData.telefone.replace(/\D/g, ''), // Remove formatação do telefone
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert(
          'Sucesso!', 
          'Profissional cadastrado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => {
                
                setFormData({
                  nome: '',
                  dataNascimento: '',
                  cpf: '',
                  registro: '',
                  genero: '',
                  telefone: '',
                  funcao: '',
                });
              }
            }
          ]
        );
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.message || 'Erro ao cadastrar profissional');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Cadastro de Profissional</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={styles.input}
            value={formData.nome}
            onChangeText={(value) => handleInputChange('nome', value)}
            placeholder="Digite o nome completo"
          />

          <Text style={styles.label}>Data de Nascimento *</Text>
          <TextInput
            style={styles.input}
            value={formData.dataNascimento}
            onChangeText={(value) => handleInputChange('dataNascimento', formatDataNascimento(value))}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
          />

          <Text style={styles.label}>CPF *</Text>
          <TextInput
            style={styles.input}
            value={formData.cpf}
            onChangeText={(value) => handleInputChange('cpf', formatCPF(value))}
            placeholder="000.000.000-00"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Registro Profissional *</Text>
          <TextInput
            style={styles.input}
            value={formData.registro}
            onChangeText={(value) => handleInputChange('registro', value)}
            placeholder="Digite o número de registro profissional"
          />

          <Text style={styles.label}>Função/ Cargo *</Text>
          <TextInput
            style={styles.input}
            value={formData.funcao}
            onChangeText={(value) => handleInputChange('funcao', value)}
            placeholder="Digite a função ou o cargo e a especialidade do profissional caso necessário"
          />

          <Text style={styles.label}>Gênero *</Text>
          <View style={styles.radioContainer}>
            {['Masculino', 'Feminino', 'Outro'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioOption}
                onPress={() => handleInputChange('genero', option)}
              >
                <View style={[
                  styles.radioCircle,
                  formData.genero === option && styles.radioSelected
                ]} />
                <Text style={styles.radioText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            style={styles.input}
            value={formData.telefone}
            onChangeText={(value) => handleInputChange('telefone', formatTelefone(value))}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={cadastrarProfissional}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar Profissional</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
});
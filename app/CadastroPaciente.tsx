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
  
export default function CadastroPaciente() {
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    cartaoSUS: '',
    genero: '',
    telefone: '',
    vacinas: [""],
    alergias: [""],
  });

  const [vacinaInput, setVacinaInput] = useState('');
  const [alergiaInput, setAlergiaInput] = useState('');

  const [loading, setLoading] = useState(false);

  const API_URL = 'https://scp-21qd.onrender.com/api/pacientes';

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

  const formatCartaoSUS = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.slice(0, 15); // Cartão SUS tem 15 dígitos
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

  const addVacina = () => {
    if (vacinaInput.trim() && !formData.vacinas.includes(vacinaInput.trim())) {
      setFormData(prev => ({
        ...prev,
        vacinas: [...prev.vacinas, vacinaInput.trim()]
      }));
      setVacinaInput('');
    }
  };

  const removeVacina = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vacinas: prev.vacinas.filter((_, i) => i !== index)
    }));
  };

  const addAlergia = () => {
    if (alergiaInput.trim() && !formData.alergias.includes(alergiaInput.trim())) {
      setFormData(prev => ({
        ...prev,
        alergias: [...prev.alergias, alergiaInput.trim()]
      }));
      setAlergiaInput('');
    }
  };

  const removeAlergia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alergias: prev.alergias.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const requiredFields = ['nome', 'dataNascimento', 'cpf', 'genero', 'telefone'];
    
    
    if (formData.dataNascimento.length !== 10) {
      Alert.alert('Erro', 'Por favor, insira uma data de nascimento válida (DD/MM/AAAA)');
      return false;
    }

    return true;
  };

  const cadastrarPaciente = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      
      const dataToSend = {
        ...formData,
        dataNascimento: convertDateToISO(formData.dataNascimento),
        cpf: formData.cpf.replace(/\D/g, ''), 
        telefone: formData.telefone.replace(/\D/g, ''), 
        cartaoSUS: formData.cartaoSUS.replace(/\D/g, ''), 
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
          'Paciente cadastrado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => {
                setFormData({
                  nome: '',
                  dataNascimento: '',
                  cpf: '',
                  cartaoSUS: '',
                  genero: '',
                  telefone: '',
                  vacinas: [],
                  alergias: [],
                });
                setVacinaInput('');
                setAlergiaInput('');
              }
            }
          ]
        );
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.message || 'Erro ao cadastrar paciente');
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
        <Text style={styles.title}>Cadastro de Pacientes</Text>

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

          <Text style={styles.label}>Cartão SUS</Text>
          <TextInput
            style={styles.input}
            value={formData.cartaoSUS}
            onChangeText={(value) => handleInputChange('cartaoSUS', formatCartaoSUS(value))}
            placeholder="123456789012345"
            keyboardType="numeric"
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

          <Text style={styles.label}>Vacinas</Text>
          <View style={styles.arrayContainer}>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[styles.input, styles.arrayInput]}
                value={vacinaInput}
                onChangeText={setVacinaInput}
                placeholder="Digite uma vacina"
              />
              <TouchableOpacity style={styles.addButton} onPress={addVacina}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              {formData.vacinas.map((vacina, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{vacina}</Text>
                  <TouchableOpacity onPress={() => removeVacina(index)}>
                    <Text style={styles.removeTag}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.label}>Alergias</Text>
          <View style={styles.arrayContainer}>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[styles.input, styles.arrayInput]}
                value={alergiaInput}
                onChangeText={setAlergiaInput}
                placeholder="Digite uma alergia"
              />
              <TouchableOpacity style={styles.addButton} onPress={addAlergia}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              {formData.alergias.map((alergia, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{alergia}</Text>
                  <TouchableOpacity onPress={() => removeAlergia(index)}>
                    <Text style={styles.removeTag}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={cadastrarPaciente}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar Paciente</Text>
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
  arrayContainer: {
    marginBottom: 16,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrayInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#28a745',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    color: '#333',
    marginRight: 6,
  },
  removeTag: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
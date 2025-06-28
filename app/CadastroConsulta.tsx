import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

export default function CadastroConsulta() {
  const [formData, setFormData] = useState({
    cartaoSUSConsulta: '',
    cpfProfissional: '',
    local: '',
    dataHora: '',  // string formatada
    motivoConsulta: '',
    especialidadeConsulta: '',
    observacoes: '',
    diagnosticoCondicao: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const API_URL = 'https://scp-21qd.onrender.com/api/consultas';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Função para formatar Date em "DD/MM/YYYY HH:mm"
  const formatDateToDisplay = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };

  // Função para formatar Date para ISO no formato usado no input datetime-local (yyyy-MM-ddTHH:mm)
  const formatDateToInputValue = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  // Função para converter valor do input datetime-local para "DD/MM/YYYY HH:mm"
  const formatInputValueToDisplay = (value: string) => {
    // valor no formato "YYYY-MM-DDTHH:mm"
    if (!value) return '';
    const [datePart, timePart] = value.split('T');
    if (!datePart || !timePart) return '';
    const [yyyy, mm, dd] = datePart.split('-');
    return `${dd}/${mm}/${yyyy} ${timePart}`;
  };

  // Quando usuário muda data no picker React Native
  const handleDateChangeMobile = (_event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      const formatted = formatDateToDisplay(date);
      handleInputChange('dataHora', formatted);
    }
  };

  // Quando usuário muda data no input web
  const handleDateChangeWeb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedDate(val ? new Date(val) : null);
    const formatted = formatInputValueToDisplay(val);
    handleInputChange('dataHora', formatted);
  };

  const showDatePicker = () => {
    if (Platform.OS === 'web') return; // no web não precisa mostrar picker do RN
    setShowPicker(true);
  };

  // Função para validar formulário (simplificada)
  const validateForm = () => {
    const required = [
      'cartaoSUSConsulta',
      'cpfProfissional',
      'local',
      'dataHora',
      'motivoConsulta',
      'especialidadeConsulta',
    ];
    for (let field of required) {
      if (!formData[field as keyof typeof formData]?.trim()) {
        Alert.alert('Erro', `O campo ${field} é obrigatório`);
        return false;
      }
    }
    if (!/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/.test(formData.dataHora)) {
      Alert.alert('Erro', 'Data e hora devem estar no formato DD/MM/AAAA HH:mm');
      return false;
    }
    return true;
  };

  // Função para converter DD/MM/YYYY HH:mm para ISO padrão
  const convertDateTimeToISO = (dt: string) => {
    if (!dt) return '';
    const [date, time] = dt.split(' ');
    if (!date || !time) return '';
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}T${time}:00`;
  };

  // Envio do formulário
  const cadastrarConsulta = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const dataToSend = {
        cartaoSUSConsulta: formData.cartaoSUSConsulta.replace(/\D/g, ''),
        cpfProfissional: formData.cpfProfissional.replace(/\D/g, ''),
        local: formData.local,
        dataHora: convertDateTimeToISO(formData.dataHora),
        motivoConsulta: formData.motivoConsulta,
        especialidadeConsulta: formData.especialidadeConsulta,
        observacoes: formData.observacoes,
        diagnosticoCondicao: formData.diagnosticoCondicao,
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        Alert.alert('Sucesso', 'Consulta cadastrada com sucesso!', [
          {
            text: 'OK',
            onPress: () =>
              setFormData({
                cartaoSUSConsulta: '',
                cpfProfissional: '',
                local: '',
                dataHora: '',
                motivoConsulta: '',
                especialidadeConsulta: '',
                observacoes: '',
                diagnosticoCondicao: '',
              }),
          },
        ]);
      } else {
        const errText = await response.text();
        console.error('Erro da API:', errText);
        Alert.alert('Erro', 'Erro do servidor. Verifique o console.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro de conexão. Tente novamente.');
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
        <Text style={styles.title}>Cadastro de Consulta</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Cartão SUS do Paciente *</Text>
          <TextInput
            style={styles.input}
            value={formData.cartaoSUSConsulta}
            onChangeText={v => handleInputChange('cartaoSUSConsulta', v)}
            placeholder="000 0000 0000 0000"
            keyboardType="numeric"
          />

          <Text style={styles.label}>CPF do Profissional *</Text>
          <TextInput
            style={styles.input}
            value={formData.cpfProfissional}
            onChangeText={v => handleInputChange('cpfProfissional', v)}
            placeholder="000.000.000-00"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Local *</Text>
          <TextInput
            style={styles.input}
            value={formData.local}
            onChangeText={v => handleInputChange('local', v)}
            placeholder="Local da consulta"
          />

          <Text style={styles.label}>Data e Hora *</Text>

          {Platform.OS === 'web' ? (
            <input
              type="datetime-local"
              value={selectedDate ? formatDateToInputValue(selectedDate) : ''}
              onChange={handleDateChangeWeb}
              style={{
                padding: 12,
                fontSize: 16,
                borderRadius: 8,
                borderColor: '#ddd',
                borderWidth: 1,
                marginBottom: 16,
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <>
              <TouchableOpacity onPress={showDatePicker}>
                <TextInput
                  style={styles.input}
                  value={formData.dataHora}
                  editable={false}
                  placeholder="DD/MM/AAAA HH:mm"
                />
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChangeMobile}
                />
              )}
            </>
          )}

          <Text style={styles.label}>Motivo da Consulta *</Text>
          <TextInput
            style={styles.input}
            value={formData.motivoConsulta}
            onChangeText={v => handleInputChange('motivoConsulta', v)}
            placeholder="Descreva o motivo"
          />

          <Text style={styles.label}>Especialidade *</Text>
          <TextInput
            style={styles.input}
            value={formData.especialidadeConsulta}
            onChangeText={v => handleInputChange('especialidadeConsulta', v)}
            placeholder="Ex: Cardiologia"
          />

          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={formData.observacoes}
            onChangeText={v => handleInputChange('observacoes', v)}
            placeholder="Observações adicionais"
            multiline
          />

          <Text style={styles.label}>Diagnóstico</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={formData.diagnosticoCondicao}
            onChangeText={v => handleInputChange('diagnosticoCondicao', v)}
            placeholder="Diagnóstico/Condição"
            multiline
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={cadastrarConsulta}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar Consulta</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { flexGrow: 1, padding: 20 },
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
    shadowOffset: { width: 0, height: 2 },
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
});

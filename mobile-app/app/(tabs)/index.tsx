// app/index.tsx

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

export default function HomeScreen() {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('Type your query and press "Ask AI" to get started!');
  const [loading, setLoading] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  const API_URL = Platform.select({
    android: 'http://10.0.2.2:5000/ask',
    ios: 'http://localhost:5000/ask',
    default: 'http://YOUR_HOST_MACHINE_IP:5000/ask',
  }) as string;

  const handleAskAI = async (): Promise<void> => {
    if (!query.trim()) {
      setResponse('Please enter a query.');
      return;
    }

    setLoading(true);
    setResponse('Thinking...');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.response);
      } else {
        setResponse(`Error from backend: ${data.error || 'Something went wrong.'}`);
      }
    } catch (error: any) {
      console.error('Network or API error:', error);
      setResponse(`Failed to connect to the AI. Is the backend running at ${API_URL}? Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <ActivityIndicator
        size="large"
        color="#6200ee"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Gemma 3n Multi-Agent Assistant</Text>
      </View>

      <ScrollView style={styles.responseContainer}>
        <Text style={styles.responseText}>{response}</Text>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask me anything..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          multiline
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleAskAI}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ask AI</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingTop: 50,
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Inter_900Black',
  },
  responseContainer: {
    flex: 1,
    padding: 20,
    margin: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
    minHeight: 45,
    maxHeight: 120,
  },
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

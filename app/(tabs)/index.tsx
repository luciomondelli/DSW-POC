import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const apiKey = ''; 

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) {
      setError('Por favor ingresa una ciudad');
      return;
    }

    try {
      setLoading(true);
      const currentWeatherResponse = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );

      const forecastResponse = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`
      );

      setWeatherData(currentWeatherResponse.data);
      setForecastData(forecastResponse.data);
      setError(''); 
    } catch (err: any) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMessage = err.response.data.error.message;
          setError(`Error: ${errorMessage}`);
        } else if (err.request) {
          setError('No hay respuesta del servidor. Verifique su conexión a Internet.');
        }
      } else {
        setError(`Ocurrio un error inesperado: ${err.message}`);
      }
      setWeatherData(null); 
      setForecastData(null); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Ingrese una ciudad"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <Button title="Obetener clima" onPress={fetchWeather} color="#007BFF" />
      {loading && <ActivityIndicator size="large" color="#007BFF" />}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : weatherData && (
        <View style={styles.weatherContainer}>
          <Text style={styles.title}>Current Weather</Text>
          <Text>Location: {weatherData.location.name}</Text>
          <Text>Temperature: {weatherData.current.temp_c} °C</Text>
          <Text>Condition: {weatherData.current.condition.text}</Text>
          <Text style={styles.title}>3-Day Forecast</Text>
          {forecastData?.forecast.forecastday.map((day: any) => (
            <View key={day.date} style={styles.forecastDay}>
              <Text>{day.date}</Text>
              <Text>Max Temp: {day.day.maxtemp_c} °C</Text>
              <Text>Min Temp: {day.day.mintemp_c} °C</Text>
              <Text>Condition: {day.day.condition.text}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderColor: '#007BFF',
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  weatherContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  forecastDay: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e7f0ff',
    elevation: 1,
  },
});

export default App;
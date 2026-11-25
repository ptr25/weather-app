
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';

const CITY = 'Tokyo, Japan';
const LATITUDE = 35;
const LONGITUDE = 139;

// Convert the API's weather code into a description
function getWeatherInfo(code) {
  if (code === 0) return ['Clear sky', '☀️'];
  if ([1, 2, 3].includes(code))
    return ['Partly cloudy', '⛅'];
  if ([45, 48].includes(code))
    return ['Foggy', '🌫️'];
  if ([51, 53, 55, 56, 57].includes(code))
    return ['Drizzle', '🌦️'];
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return ['Rainy', '🌧️'];
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return ['Snowy', '❄️'];
  if ([95, 96, 99].includes(code))
    return ['Thunderstorm', '⛈️'];

  return ['Unknown weather', '🌤️'];
}

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LATITUDE}` +
        `&longitude=${LONGITUDE}` +
        `&current=temperature_2m,relative_humidity_2m,` +
        `weather_code,wind_speed_10m` +
        `&timezone=auto`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Weather request failed');
      }

      const data = await response.json();

      if (!data.current) {
        throw new Error('Weather data unavailable');
      }

      setWeather(data.current);
    } catch (err) {
      setError('Could not load weather. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  const weatherInfo = weather
    ? getWeatherInfo(weather.weather_code)
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <StatusBar barStyle="dark-content" />

      <Text style={styles.smallTitle}>
        MY LITTLE WEATHER APP
      </Text>

      <Text style={styles.title}>
        Weather Forecast ☁️
      </Text>

      <Text style={styles.city}>{CITY}</Text>

      {loading ? (
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#3664B1" />
          <Text style={styles.message}>
            Checking the skies...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.card}>
          <Text style={styles.emoji}>🌧️</Text>
          <Text style={styles.message}>{error}</Text>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.emoji}>
              {weatherInfo[1]}
            </Text>

            <Text style={styles.temperature}>
              {Math.round(weather.temperature_2m)}°C
            </Text>

            <Text style={styles.description}>
              {weatherInfo[0]}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>💧</Text>
              <Text style={styles.infoLabel}>Humidity</Text>
              <Text style={styles.infoValue}>
                {weather.relative_humidity_2m}%
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>💨</Text>
              <Text style={styles.infoLabel}>Wind Speed</Text>
              <Text style={styles.infoValue}>
                {Math.round(weather.wind_speed_10m)} km/h
              </Text>
            </View>
          </View>
        </>
      )}

      <Pressable
        style={styles.button}
        onPress={getWeather}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : '↻ Refresh Weather'}
        </Text>
      </Pressable>

      <Text style={styles.footer}>
        Made with React Native & a little curiosity 💙
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDECFB',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 35,
    alignItems: 'center',
  },
  smallTitle: {
    fontSize: 12,
    color: '#61718B',
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#243D65',
    textAlign: 'center',
  },
  city: {
    fontSize: 16,
    color: '#657893',
    marginTop: 10,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 25,
    padding: 35,
    minHeight: 245,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 65,
    marginBottom: 15,
  },
  temperature: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#263E66',
  },
  description: {
    fontSize: 18,
    color: '#506786',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  infoEmoji: {
    fontSize: 27,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#71809A',
  },
  infoValue: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#294367',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#3664B1',
    paddingVertical: 17,
    paddingHorizontal: 30,
    borderRadius: 14,
    marginTop: 28,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    color: '#506786',
  },
  footer: {
    marginTop: 35,
    fontSize: 12,
    color: '#8390A2',
    textAlign: 'center',
  },
});

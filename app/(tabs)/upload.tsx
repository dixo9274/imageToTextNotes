import { useState} from 'react';
import Tesseract from 'tesseract.js';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { View, Text, Button, Image, StyleSheet, Platform, ScrollView } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';

export default function UploadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [imagePath, setImagePath] = useState<string | null>(null);
  const [text, setText] = useState("");

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagePath(result.assets[0].uri);
    }
  };

  const handleClick = () => {
    if (imagePath) {
      Tesseract.recognize(imagePath, 'eng', { logger: m => console.log(m) })
        .catch(err => {
          console.error(err);
        })
        .then(result => {
          if (result && result.data) {
            const confidence = result.data.confidence;
            const extractedText = result.data.text;
            setText(`Confidence: ${confidence}\nText:\n${extractedText}`);
          }
        });
    } else {
      alert("Please upload an image first.");
    }
  };

  const handleSaveNote = () => {
    router.push({
      pathname: '/Saved',
      params: { content: text },
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
      
        <Text style={styles.titleContainer}>ImageToText</Text>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Upload Image</ThemedText>
          <View style={styles.buttonView}>
            <Button title="Choose File" onPress={handleImagePick} />
          </View>
            {imagePath && (
              <Image
                source={{ uri: imagePath }}
                style={styles.image}
              />
            )}
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 2: Extract Text From Image</ThemedText>
          <View style={styles.buttonView}>
            <Button title="Convert to Text" onPress={handleClick} />
          </View>
          <Text style={styles.text}>{text}</Text> 
        </ThemedView>

        <View style={styles.containerCol}>
          <Button title="Save to Notes" onPress={handleSaveNote} />
          <Button title="Copy" onPress={copyToClipboard} />
        </View>

      </View>  
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  titleContainer: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    backgroundColor: ' #808080',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    backgroundColor: ' #808080',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  containerCol: {
    flexDirection: 'row', 
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    // whiteSpace: 'pre-wrap', // For formatting multi-line text
  },
  View: {
    width: '33%',
  },
  buttonView: {
    width: '40%',
    alignSelf: 'flex-start',
  }
});
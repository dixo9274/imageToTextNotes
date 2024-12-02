import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTesseract } from 'react-tesseract';

export default function UploadMobileScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { recognize, error, result, isRecognizing } = useTesseract();

  const handleRecognize = async () => {
    if (imageUri) {
      await recognize(imageUri, {
        language: 'eng',
        errorHandler: (err: Error) => console.error(err), // Explicitly typing error
        tessedit_ocr_engine_mode: 1, // Neural net LSTM engine only
        tessedit_pageseg_mode: 1, // Single uniform block of text
      });
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    } else {
      console.log('Image picking canceled or failed');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an Image" onPress={handleImagePick} />
      {imageUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <Text>Selected Image: {imageUri}</Text>
        </View>
      )}
      <Button title="Recognize Text" onPress={handleRecognize} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});
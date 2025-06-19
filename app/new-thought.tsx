import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Image as ImageIcon, FileText, Chrome as Home, Search, Plus, Bookmark, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInDown,
} from 'react-native-reanimated';
import { ThoughtStorage } from '@/utils/storage';
import { OCRService } from '@/utils/ocr';

export default function NewThoughtScreen() {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setIsProcessing(true);
        setProcessingText('Extracting text from image...');
        
        try {
          const extractedText = await OCRService.extractTextFromImage(result.assets[0].uri);
          setContent(extractedText);
        } catch (error) {
          Alert.alert('Error', 'Failed to extract text from image. Please try again.');
        } finally {
          setIsProcessing(false);
          setProcessingText('');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      setIsProcessing(false);
      setProcessingText('');
    }
  };

  const handleDocumentUpload = async () => {
    Alert.alert('Coming Soon', 'Document upload feature will be available soon!');
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content before saving.');
      return;
    }

    try {
      await ThoughtStorage.saveThought({
        content: content.trim(),
        category: 'Category 1',
        timestamp: Date.now(),
      });
      
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save thought. Please try again.');
    }
  };

  const handleDiscard = () => {
    if (content.trim()) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInUp} style={styles.header}>
        <TouchableOpacity onPress={handleDiscard} style={styles.closeButton}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>New Thought</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Upload</Text>
          
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImageUpload}
            disabled={isProcessing}
          >
            <ImageIcon size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleDocumentUpload}
            disabled={isProcessing}
          >
            <FileText size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>
        </Animated.View>

        {isProcessing && (
          <Animated.View entering={SlideInDown} style={styles.processingSection}>
            <Text style={styles.sectionTitle}>Processing</Text>
            <View style={styles.processingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.processingText}>{processingText}</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.inputLabel}>Enter your thought here</Text>
          <TextInput
            style={styles.textInput}
            value={content}
            onChangeText={setContent}
            placeholder="Start typing..."
            placeholderTextColor="#666"
            multiline
            textAlignVertical="top"
          />
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(600)} style={styles.bottomSection}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.discardButton}
            onPress={handleDiscard}
          >
            <Text style={styles.discardButtonText}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!content.trim() || isProcessing}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/')}>
            <Home size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Search size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, styles.navButtonActive]}>
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Bookmark size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <User size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  processingSection: {
    marginTop: 24,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  processingText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  discardButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  discardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
  },
  navButton: {
    padding: 8,
  },
  navButtonActive: {
    backgroundColor: '#333',
    borderRadius: 8,
  },
});
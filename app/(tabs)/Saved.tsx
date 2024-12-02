import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from 'expo-router';


// Define the Note type
type Note = {
    id: number;
    title: string;
    content: string;
};

export default function SavedScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]); 
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [title, setTitle] = useState(""); 
    const [content, setContent] = useState(""); 
    const [modalVisible, setModalVisible] = useState(false); 

    const saveNotesToStorage = async (notes: Note[]) => {
        try {
            const jsonNotes = JSON.stringify(notes);
            await AsyncStorage.setItem("notes", jsonNotes);
        } catch (error) {
            console.error("Error saving notes to storage:", error);
        }
    };

    const loadNotesFromStorage = async () => {
        try {
            const jsonNotes = await AsyncStorage.getItem("notes");
            if (jsonNotes) {
                setNotes(JSON.parse(jsonNotes));
            }
        } catch (error) {
            console.error("Error loading notes from storage:", error);
        }
    };
    
    useEffect(() => {
        loadNotesFromStorage();
    }, []);

    const handleSaveNote = () => {
        if (selectedNote) {
            const updatedNotes = notes.map((note) =>
                note.id === selectedNote.id
                    ? { ...note, title, content }
                    : note
            );
            setNotes(updatedNotes);
            saveNotesToStorage(updatedNotes);
            setSelectedNote(null);
        } else {
            const newNote: Note = {
                id: Date.now(),
                title,
                content,
            };
            const updatedNotes = [...notes, newNote];
            setNotes(updatedNotes);
            saveNotesToStorage(updatedNotes); 
        }
        setTitle("");
        setContent("");
        setModalVisible(false);

        router.push({
            pathname: "/Saved",
        });
    };
    
    const handleDeleteNote = (note: Note) => {
        const updatedNotes = notes.filter((item) => item.id !== note.id);
        setNotes(updatedNotes);
        saveNotesToStorage(updatedNotes);
        setSelectedNote(null);
        setModalVisible(false);
    };

    const handleEditNote = (note: Note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
        setModalVisible(true);
    };

    useEffect(() => {
        if (params.content) {
            const content = Array.isArray(params.content) ? params.content[0] : params.content;

            setTitle("");
            setContent(content);
            setModalVisible(true);
           
        }
      }, [params.content]);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Notes</Text>

            <ScrollView style={styles.noteList}>
                {notes.map((note) => (
                    <TouchableOpacity
                        key={note.id}
                        onPress={() => handleEditNote(note)}
                    >
                        <Text style={styles.noteTitle}>{note.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    setTitle("");
                    setContent("");
                    setModalVisible(true);
                }}
            >
                <Text style={styles.addButtonText}>Add Note</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent={false}>
                <View style={styles.modalContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter note title"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput
                        style={styles.contentInput}
                        multiline
                        placeholder="Enter note content"
                        value={content}
                        onChangeText={setContent}
                    />

                    <View style={styles.buttonContainer}>
                        <Button title="Save" onPress={handleSaveNote} color="#007BFF" />
                        <Button
                            title="Cancel"
                            onPress={() => setModalVisible(false)}
                            color="#FF3B30"
                        />
                        {selectedNote && (
                            <Button
                                title="Delete"
                                onPress={() => handleDeleteNote(selectedNote)}
                                color="#FF9500"
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: "#e6e6e6",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    noteList: {
        flex: 1,
    },
    noteTitle: {
        fontSize: 15,
        marginBottom: 10,
        fontWeight: "bold",
        color: "black",
        backgroundColor: "white",
        height: 40,
        width: "100%",
        padding: 10,
        borderRadius: 8,
    },
    addButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        borderRadius: 5,
        marginTop: 10,
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        padding: 50,
        backgroundColor: "white",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    contentInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        height: 150,
        textAlignVertical: "top",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

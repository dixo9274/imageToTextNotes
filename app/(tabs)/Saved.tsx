// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, Alert, } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { supabase } from "@/lib/supabase";
// import { User } from "@supabase/supabase-js";


// // Define the Note type
// type Note = {
//     id: number;
//     title: string;
//     content: string;
// };

// export default function SavedScreen() {
//     const params = useLocalSearchParams();
//     const router = useRouter();
//     const [notes, setNotes] = useState<Note[]>([]); 
//     const [selectedNote, setSelectedNote] = useState<Note | null>(null);
//     const [title, setTitle] = useState(""); 
//     const [content, setContent] = useState(""); 
//     const [modalVisible, setModalVisible] = useState(false);
//     const [user, setUser] = useState<User | null>(null)
//     const [data, setData] = useState<Note | null>(null)

//   useEffect(() => {
//     // Use getUser instead of getSession
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       if (user) {
//         setUser(user)
//       } else {
//         Alert.alert("Error Accessing User")
//       }
//     })

//     const fetchSession = () => {
//         const session = sessionStorage.getItem("token");
//         if (session) {
//             //setToken(true);
//             const userDetails = JSON.parse(session);
//             fetchNotes(userDetails.user.id);
//         }
//     };
//     fetchSession();
//   }, [])

//     const saveNote = async () => {
//         try {
//             const { error } = await supabase
//                 .from("notes")
//                 .insert({ title, content, slug: titleToSlug(title), user: user?.id})
//                 .single();
//             if (error) throw error;
//             //navigate("/dashboard");
//         } catch (err) {
//             console.error(err);
//         }
//     };
    
//     //👇🏻 creates a slug from the title
//     const titleToSlug = (title: string): string => {
//         const slug = title.toLowerCase().replace(/\s+/g, "-");
//         const cleanSlug = slug.replace(/[^a-zA-Z0-9-]/g, "");
//         return cleanSlug + `${Math.random().toString(36).substring(2, 10)}`;
//     };

// async function fetchNotes(id: string) {
//     try {
//         const { data, error } = await supabase
//             .from("notes")
//             .select()
//             .eq("user", id);
//         if (error) throw error;
//         setNotes(data);
//     } catch (error) {
//         alert("Error fetching notes");
//     }

//     async function fetchData() {
//         try {
        
//             const { data, error } = await supabase
//                 .from("notes")
//                 .select()
//                 .eq("slug", titleToSlug(title));
//             if (error) throw error;
//             setData(data);
//         } catch (err) {
//             console.error(err);
//         }
//     }

//     useEffect(() => {
//         const fetchSession = () => {
//             const session = sessionStorage.getItem("token");
//             if (session) {
//                 // setToken(true);
//                 fetchData();
//             }
//         };
//         fetchSession();
//     }, []);

//     const updateNoteData = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         try {
//             const { error } = await supabase
//                 .from("notes")
//                 .update({
//                     title: noteTitle,
//                     content: noteContent,
//                     slug: titleToSlug(noteTitle),
//                 })
//                 .eq("id", noteID);
//             if (error) throw error;
//             alert("Updated successfully!🎉");
//             // navigate("/dashboard");
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const handleDelete = async () => {
//         try {
//             const { error } = await supabase.from("notes").delete().eq("id", noteID);
//             if (error) throw error;
//             // navigate("/dashboard");
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const loadNotesFromStorage = async () => {
//         try {
//             const jsonNotes = await AsyncStorage.getItem("notes");
//             if (jsonNotes) {
//                 setNotes(JSON.parse(jsonNotes));
//             }
//         } catch (error) {
//             console.error("Error loading notes from storage:", error);
//         }
//     };
    
//     useEffect(() => {
//         loadNotesFromStorage();
//     }, []);

//     const handleSaveNote = () => {
//         if (selectedNote) {
//             const updatedNotes = notes.map((note) =>
//                 note.id === selectedNote.id
//                     ? { ...note, title, content }
//                     : note
//             );
//             setNotes(updatedNotes);
//             saveNote(updatedNotes);
//             setSelectedNote(null);
//         } else {
//             const newNote: Note = {
//                 id: Date.now(),
//                 title,
//                 content,
//             };
//             const updatedNotes = [...notes, newNote];
//             setNotes(updatedNotes);
//             saveNotesToStorage(updatedNotes); 
//         }
//         setTitle("");
//         setContent("");
//         setModalVisible(false);

//         router.push({
//             pathname: "/Saved",
//         });
//     };
    
//     const handleDeleteNote = (note: Note) => {
//         const updatedNotes = notes.filter((item) => item.id !== note.id);
//         setNotes(updatedNotes);
//         saveNotesToStorage(updatedNotes);
//         setSelectedNote(null);
//         setModalVisible(false);
//     };

//     const handleEditNote = (note: Note) => {
//         setSelectedNote(note);
//         setTitle(note.title);
//         setContent(note.content);
//         setModalVisible(true);
//     };

//     useEffect(() => {
//         if (params.content) {
//             const content = Array.isArray(params.content) ? params.content[0] : params.content;

//             setTitle("");
//             setContent(content);
//             setModalVisible(true);
           
//         }
//       }, [params.content]);


//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>My Notes</Text>

//             <ScrollView style={styles.noteList}>
//                 {notes.map((note) => (
//                     <TouchableOpacity
//                         key={note.id}
//                         onPress={() => handleEditNote(note)}
//                     >
//                         <Text style={styles.noteTitle}>{note.title}</Text>
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>

//             <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={() => {
//                     setTitle("");
//                     setContent("");
//                     setModalVisible(true);
//                 }}
//             >
//                 <Text style={styles.addButtonText}>Add Note</Text>
//             </TouchableOpacity>

//             <Modal visible={modalVisible} animationType="slide" transparent={false}>
//                 <View style={styles.modalContainer}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter note title"
//                         value={title}
//                         onChangeText={setTitle}
//                     />

//                     <TextInput
//                         style={styles.contentInput}
//                         multiline
//                         placeholder="Enter note content"
//                         value={content}
//                         onChangeText={setContent}
//                     />

//                     <View style={styles.buttonContainer}>
//                         <Button title="Save" onPress={handleSaveNote} color="#007BFF" />
//                         <Button
//                             title="Cancel"
//                             onPress={() => setModalVisible(false)}
//                             color="#FF3B30"
//                         />
//                         {selectedNote && (
//                             <Button
//                                 title="Delete"
//                                 onPress={() => handleDeleteNote(selectedNote)}
//                                 color="#FF9500"
//                             />
//                         )}
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 40,
//         backgroundColor: "#e6e6e6",
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginBottom: 10,
//         color: "#333",
//     },
//     noteList: {
//         flex: 1,
//     },
//     noteTitle: {
//         fontSize: 15,
//         marginBottom: 10,
//         fontWeight: "bold",
//         color: "black",
//         backgroundColor: "white",
//         height: 40,
//         width: "100%",
//         padding: 10,
//         borderRadius: 8,
//     },
//     addButton: {
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#007BFF",
//         paddingVertical: 12,
//         borderRadius: 5,
//         marginTop: 10,
//     },
//     addButtonText: {
//         color: "white",
//         fontSize: 16,
//         fontWeight: "bold",
//     },
//     modalContainer: {
//         flex: 1,
//         padding: 50,
//         backgroundColor: "white",
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: "#E0E0E0",
//         padding: 10,
//         marginBottom: 10,
//         borderRadius: 5,
//     },
//     contentInput: {
//         borderWidth: 1,
//         borderColor: "#E0E0E0",
//         padding: 10,
//         marginBottom: 20,
//         borderRadius: 5,
//         height: 150,
//         textAlignVertical: "top",
//     },
//     buttonContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//     },
// });


// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useLocalSearchParams, useRouter } from 'expo-router';


// // Define the Note type
// type Note = {
//     id: number;
//     title: string;
//     content: string;
// };

// export default function SavedScreen() {
//     const params = useLocalSearchParams();
//     const router = useRouter();
//     const [notes, setNotes] = useState<Note[]>([]); 
//     const [selectedNote, setSelectedNote] = useState<Note | null>(null);
//     const [title, setTitle] = useState(""); 
//     const [content, setContent] = useState(""); 
//     const [modalVisible, setModalVisible] = useState(false); 

//     const saveNotesToStorage = async (notes: Note[]) => {
//         try {
//             const jsonNotes = JSON.stringify(notes);
//             await AsyncStorage.setItem("notes", jsonNotes);
//         } catch (error) {
//             console.error("Error saving notes to storage:", error);
//         }
//     };

//     const loadNotesFromStorage = async () => {
//         try {
//             const jsonNotes = await AsyncStorage.getItem("notes");
//             if (jsonNotes) {
//                 setNotes(JSON.parse(jsonNotes));
//             }
//         } catch (error) {
//             console.error("Error loading notes from storage:", error);
//         }
//     };
    
//     useEffect(() => {
//         loadNotesFromStorage();
//     }, []);

//     const handleSaveNote = () => {
//         if (selectedNote) {
//             const updatedNotes = notes.map((note) =>
//                 note.id === selectedNote.id
//                     ? { ...note, title, content }
//                     : note
//             );
//             setNotes(updatedNotes);
//             saveNotesToStorage(updatedNotes);
//             setSelectedNote(null);
//         } else {
//             const newNote: Note = {
//                 id: Date.now(),
//                 title,
//                 content,
//             };
//             const updatedNotes = [...notes, newNote];
//             setNotes(updatedNotes);
//             saveNotesToStorage(updatedNotes); 
//         }
//         setTitle("");
//         setContent("");
//         setModalVisible(false);

//         router.push({
//             pathname: "/Saved",
//         });
//     };
    
//     const handleDeleteNote = (note: Note) => {
//         const updatedNotes = notes.filter((item) => item.id !== note.id);
//         setNotes(updatedNotes);
//         saveNotesToStorage(updatedNotes);
//         setSelectedNote(null);
//         setModalVisible(false);
//     };

//     const handleEditNote = (note: Note) => {
//         setSelectedNote(note);
//         setTitle(note.title);
//         setContent(note.content);
//         setModalVisible(true);
//     };

//     useEffect(() => {
//         if (params.content) {
//             const content = Array.isArray(params.content) ? params.content[0] : params.content;

//             setTitle("");
//             setContent(content);
//             setModalVisible(true);
           
//         }
//       }, [params.content]);


//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>My Notes</Text>

//             <ScrollView style={styles.noteList}>
//                 {notes.map((note) => (
//                     <TouchableOpacity
//                         key={note.id}
//                         onPress={() => handleEditNote(note)}
//                     >
//                         <Text style={styles.noteTitle}>{note.title}</Text>
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>

//             <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={() => {
//                     setTitle("");
//                     setContent("");
//                     setModalVisible(true);
//                 }}
//             >
//                 <Text style={styles.addButtonText}>Add Note</Text>
//             </TouchableOpacity>

//             <Modal visible={modalVisible} animationType="slide" transparent={false}>
//                 <View style={styles.modalContainer}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter note title"
//                         value={title}
//                         onChangeText={setTitle}
//                     />

//                     <TextInput
//                         style={styles.contentInput}
//                         multiline
//                         placeholder="Enter note content"
//                         value={content}
//                         onChangeText={setContent}
//                     />

//                     <View style={styles.buttonContainer}>
//                         <Button title="Save" onPress={handleSaveNote} color="#007BFF" />
//                         <Button
//                             title="Cancel"
//                             onPress={() => setModalVisible(false)}
//                             color="#FF3B30"
//                         />
//                         {selectedNote && (
//                             <Button
//                                 title="Delete"
//                                 onPress={() => handleDeleteNote(selectedNote)}
//                                 color="#FF9500"
//                             />
//                         )}
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 40,
//         backgroundColor: "#e6e6e6",
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginBottom: 10,
//         color: "#333",
//     },
//     noteList: {
//         flex: 1,
//     },
//     noteTitle: {
//         fontSize: 15,
//         marginBottom: 10,
//         fontWeight: "bold",
//         color: "black",
//         backgroundColor: "white",
//         height: 40,
//         width: "100%",
//         padding: 10,
//         borderRadius: 8,
//     },
//     addButton: {
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#007BFF",
//         paddingVertical: 12,
//         borderRadius: 5,
//         marginTop: 10,
//     },
//     addButtonText: {
//         color: "white",
//         fontSize: 16,
//         fontWeight: "bold",
//     },
//     modalContainer: {
//         flex: 1,
//         padding: 50,
//         backgroundColor: "white",
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: "#E0E0E0",
//         padding: 10,
//         marginBottom: 10,
//         borderRadius: 5,
//     },
//     contentInput: {
//         borderWidth: 1,
//         borderColor: "#E0E0E0",
//         padding: 10,
//         marginBottom: 20,
//         borderRadius: 5,
//         height: 150,
//         textAlignVertical: "top",
//     },
//     buttonContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//     },
// });

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

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
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            setUser(user)
          } 
        });
      }, []);

      
      const saveNotesToStorage = async (note: Note) => {
        if (!user) {
            alert("User is not authenticated!");
            return;
        }
    
        try {
            const { error } = await supabase
                .from("notes")
                .insert({ 
                    title: note.title,
                    content: note.content,
                    slug: titleToSlug(note.title),
                    user: user.id
                })
                .single();
    
            if (error) {
                console.error("Error saving note:", error);
                throw new Error(error.message);
            }
    
            console.log("Note saved successfully!");
        } catch (err) {
            console.error("Error saving note:", err);
        }
    };
    

    const titleToSlug = (title: string): string => {
        const slug = title.toLowerCase().replace(/\s+/g, "-");
        const cleanSlug = slug.replace(/[^a-zA-Z0-9-]/g, "");
        return cleanSlug + `${Math.random().toString(36).substring(2, 10)}`;
    };

    useEffect(() => {
        if (user) {
            fetchNotes(user.id);
        }
    }, [user]);
    
    const fetchNotes = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("notes")
                .select("*")
                .eq("user", userId);
    
            if (error) throw error;
    
            if (data) {
                setNotes(data);
            }
        } catch (err) {
            console.error("Error fetching notes:", err);
        }
    };
    
    // const handleSignOut = async () => {
    //     await supabase.auth.signOut();  // Sign out from Supabase
    //     setUser(null);                   // Clear the user state
    //     setNotes([]);                    // Clear the notes state
    // };

    const updateNoteInStorage = async (note: Note) => {
        if (!user) {
            alert("User is not authenticated!");
            return;
        }
    
        try {
            const { error } = await supabase
                .from("notes")
                .update({
                    title: note.title,
                    content: note.content,
                    slug: titleToSlug(note.title),
                })
                .eq("id", note.id)
                .single();
    
            if (error) {
                console.error("Error updating note:", error);
                throw new Error(error.message);
            }
    
            console.log("Note updated successfully!");
        } catch (err) {
            console.error("Error updating note:", err);
        }
    };

    const handleSaveNote = () => {
        if (!title || !content) {
            alert("Please provide both title and content.");
            return;
        }
    
        if (selectedNote) {
            const updatedNote: Note = {
                id: selectedNote.id,
                title,
                content,
            };
    
            const updatedNotes = notes.map((note) =>
                note.id === selectedNote.id ? updatedNote : note
            );
            setNotes(updatedNotes);
            updateNoteInStorage(updatedNote);
        } else {
            const newNote: Note = {
                id: Date.now(),
                title,
                content,
            };
    
            const updatedNotes = [...notes, newNote];
            setNotes(updatedNotes);
            saveNotesToStorage(newNote);
        }
    
        setTitle(""); 
        setContent(""); 
        setModalVisible(false);
        router.push("/Saved");
    };
    
    const handleDeleteNote = async (note: Note) => {
        if (!user) {
            alert("User is not authenticated!");
            return;
        }
    
        try {
            const { error } = await supabase
                .from("notes")
                .delete()
                .eq("id", note.id)
                .single();
    
            if (error) {
                console.error("Error deleting note:", error);
                throw new Error(error.message);
            }
    
            const updatedNotes = notes.filter((item) => item.id !== note.id);
            setNotes(updatedNotes);
            setModalVisible(false);
            router.push("/Saved");
    
            console.log("Note deleted successfully!");
        } catch (err) {
            console.error("Error deleting note:", err);
        }
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

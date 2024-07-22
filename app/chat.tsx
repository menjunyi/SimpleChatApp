import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'system';
    read: boolean;
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);

    const handleSendMessage = async () => {
        if (inputText.trim() === '') return;

        const userMessage: Message = {
            id: Math.random().toString(),
            text: inputText,
            sender: 'user',
            read: true
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputText('');
        console.log(inputText)
        try {
            const response = await axios.post('https://98qrw8pgt2.execute-api.ap-southeast-2.amazonaws.com/get-name', {
                input_query: inputText
            });
            console.log(response.data.name)
            const systemMessage: Message = {
                id: Math.random().toString(),
                text: response.data.name,
                sender: 'system',
                read: false
            };
            setMessages((prevMessages) => [...prevMessages, systemMessage]);
            setUnreadCount((prevCount) => prevCount + 1);
        } catch (error) {
            console.error('Error fetching system response:', error);
        }
    };

    const handleReadMessage = (id: string) => {
        setMessages((prevMessages) => {
            const updatedMessages = prevMessages.map((msg) =>
                msg.id === id ? { ...msg, read: true } : msg
            );
            const newUnreadCount = updatedMessages.filter((msg) => !msg.read).length;
            setUnreadCount(newUnreadCount);
            return updatedMessages;
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.unreadCount}>Unread Messages: {unreadCount}</Text>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleReadMessage(item.id)}>
                        <View
                            style={[
                                styles.messageBubble,
                                item.sender === 'user' ? styles.userBubble : styles.systemBubble,
                            ]}
                        >
                            <Text style={item.read ? styles.readText : styles.unreadText}>{item.text}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                />
                <Button title="Send" onPress={handleSendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    unreadCount: {
        fontSize: 18,
        textAlign: 'center',
    },
    messageBubble: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    systemBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    readText: {
        color: '#000',
    },
    unreadText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default Chat;


import React, { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig"; 
import AttachFileIcon from '@mui/icons-material/AttachFile'; 
import "./ChatPage.css";
import DoctorSidebar from "./DoctorSidebar";
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import MicIcon from '@mui/icons-material/Mic'; 

import { 
  collection, query, where, getDocs, orderBy, doc, setDoc, getDoc, addDoc ,limit ,onSnapshot 
} from "firebase/firestore";


const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

const ChatPage = () => {
  const userID = localStorage.getItem("userID"); 

  const [selectedChat, setSelectedChat] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(""); 

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 

  const [chats, setChats] = useState([]); 
  
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState(null);


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];
  
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
  
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          sendMessage(null, reader.result, "audio/webm");
        };
      };
  
      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const fetchChats = () => {
    if (!userID) return;
  
    const chatsRef = collection(db, "chats");
  
    // to fetch all chats 
    const q = query(chatsRef, where("user1ID", "==", userID));
    const q2 = query(chatsRef, where("user2ID", "==", userID));
  
    return onSnapshot(q, async (snapshot1) => {
      return onSnapshot(q2, async (snapshot2) => {
        let chatList = [
          ...snapshot1.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          ...snapshot2.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        ];
  
        // fetch users info and last message 
        const updatedChatList = await Promise.all(chatList.map(async (chat) => {
          const otherUserID = chat.user1ID === userID ? chat.user2ID : chat.user1ID;
          const userDoc = await getDoc(doc(db, "users", otherUserID));
  
          let userName = "Unknown User";
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userName = `${userData.firstName} ${userData.lastName}`;
          }
  
          return {
            id: chat.id,
            userName: userName,
            lastMessage: chat.lastMessage || "No messages yet",
            lastMessageTime: chat.lastMessageTime?.toMillis() || 0
          };
        }));
  
        // sort chats 
        updatedChatList.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  
        setChats(updatedChatList);
      });
    });
  };
  

  useEffect(() => {
    const unsubscribe = fetchChats();
    return () => unsubscribe && unsubscribe();
  }, [userID]);
  

  //handle selectd user 
  const handleUserSelect = async (user) => {
    const chatID = [userID, user.uid].sort().join("_");
    const chatRef = doc(db, "chats", chatID);
    const chatSnap = await getDoc(chatRef);
  
    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        user1ID: userID,
        user2ID: user.uid,
        lastMessage: "",
        lastMessageTime: null,
      });
    }
  
    setSearchResults([]);
    setSearchQuery("");
  
    loadMessages(chatID);
  };
  

  //search process 
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]); 
      return;
    }
  
    const timeout = setTimeout(() => {
      searchUser();
    }, 500); 
  
    return () => clearTimeout(timeout);
  }, [searchQuery]);
  

  // to load messages
  const loadMessages = async (chatID) => {
        setSelectedChat(chatID); 
    
        const chatRef = doc(db, "chats", chatID);
        const chatSnap = await getDoc(chatRef);
    
        if (chatSnap.exists()) {
        const chatData = chatSnap.data();
        const otherUserID = chatData.user1ID === userID ? chatData.user2ID : chatData.user1ID;
        
        //fetch user name 
        const userDoc = await getDoc(doc(db, "users", otherUserID));
        let chatUserName = "Unknown User";
        if (userDoc.exists()) {
            const userData = userDoc.data();
            chatUserName = `${userData.firstName} ${userData.lastName}`;
        }
    
        setSelectedChat({ id: chatID, name: chatUserName }); 
        }
    
        const messagesRef = collection(db, `chats/${chatID}/messages`);
        const q = query(messagesRef, orderBy("timestamp", "asc"));
    
        return onSnapshot(q, (snapshot) => {
        const messageList = snapshot.docs.map((doc) => doc.data());
        setMessages(messageList);
        });
    };
  
    
  //search user 
  const searchUser = async () => {
  if (!searchQuery.trim()) return;

  const usersRef = collection(db, "users");

  const queries = [
    query(usersRef, where("firstName", ">=", searchQuery), where("firstName", "<=", searchQuery + "\uf8ff")),
    query(usersRef, where("lastName", ">=", searchQuery), where("lastName", "<=", searchQuery + "\uf8ff")),
    query(usersRef, where("phone", "==", searchQuery)),
    query(usersRef, where("email", "==", searchQuery)),
    query(usersRef, where("doctorId", "==", searchQuery))
  ];

  const querySnapshots = await Promise.all(queries.map((q) => getDocs(q)));
  const results = new Map();
  querySnapshots.forEach((snap) => {
    snap.docs.forEach((doc) => results.set(doc.id, { id: doc.id, ...doc.data() }));
  });

  setSearchResults([...results.values()]);
};

  
// send new message
const sendMessage = async (file, audioData = null, audioType = null) => {
    if (!newMessage.trim() && !file && !audioData) return;
    if (!selectedChat?.id) return;
  
    const chatRef = doc(db, "chats", selectedChat.id);
    const messagesRef = collection(chatRef, "messages");
    let fileData = null;
    let fileType = null;
  
    if (file) {
      fileData = await convertFileToBase64(file);
      fileType = file.type;
    }
  
    if (audioData) {
      fileData = audioData;
      fileType = audioType;
    }
  
    await addDoc(messagesRef, {
      senderID: userID,
      message: newMessage || "", 
      fileData: fileData || null, 
      fileType: fileType || null, 
      timestamp: new Date(),
      status: "delivered",
    });
  
    await setDoc(chatRef, { 
      lastMessage: file ? "📎 File Sent" : audioData ? "🎤 Voice Message" : newMessage, 
      lastMessageTime: new Date() 
    }, { merge: true });
  
    setNewMessage("");
  };
  
  return (
    <div className="chat-page-container">
    <DoctorSidebar />
    <div className="chat-content">
      
      {/* chat window*/}
      <div className="chat-window">
        {selectedChat ? (
          <>
            <div className="chat-header">
            <h3>Chat with {selectedChat?.name}</h3>
            </div>
            {/* <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.senderID === userID ? "sent" : "received"}`}>
                    {msg.fileData ? (
                    msg.fileType?.startsWith("image/") ? (
                        <img src={msg.fileData} alt="Sent Image" className="chat-image" />
                    ) : msg.fileType?.startsWith("audio/") ? (
                        <audio controls>
                        <source src={msg.fileData} type={msg.fileType} />
                        Your browser does not support the audio element.
                        </audio>
                    ) : (
                        <a href={msg.fileData} download>
                        📎 Download File
                        </a>
                    )
                    ) : (
                    <p>{msg.message}</p>
                   )}
                <span className="timestamp">{new Date(msg.timestamp.toDate()).toLocaleTimeString()}</span>
                </div>
              ))}
            </div> */}

            <div className="messages">
            {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.senderID === userID ? "sent" : "received"}`}>
                {msg.fileData ? (
                    msg.fileType?.startsWith("image/") ? (
                    <img
                        src={msg.fileData}
                        alt="Sent Image"
                        className="chat-image"
                        onClick={() => setSelectedImage(msg.fileData)} // ✅ عند الضغط، يتم عرض الصورة في `Popup`
                    />
                    ) : msg.fileType?.startsWith("audio/") ? (
                    <audio controls>
                        <source src={msg.fileData} type={msg.fileType} />
                        Your browser does not support the audio element.
                    </audio>
                    ) : (
                    <a href={msg.fileData} download>
                        📎 Download File
                    </a>
                    )
                ) : (
                    <p>{msg.message}</p>
                )}
                <span className="timestamp">{new Date(msg.timestamp.toDate()).toLocaleTimeString()}</span>
                </div>
            ))}
            </div>

            {/*message popup*/}
           {/* ✅ Popup عند الضغط على صورة */}
            {selectedImage && (
            <div className="image-popup">
                <div className="image-popup-content">
                <button className="close-popup-btn" onClick={() => setSelectedImage(null)}>❌</button>
                <img src={selectedImage} alt="Enlarged Image" />
                </div>
            </div>
            )}



           
            <div className="message-input">
            <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(null)} 
            />
           
            <button className="file-upload-btn" onClick={() => document.getElementById("fileInput").click()}>
            <AttachFileIcon />
            </button>
            <button className="voice-record-btn" onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? "⏹️" : <MicIcon />}
            </button>
            <input
            type="file"
            id="fileInput"
            accept="image/*, application/pdf"
            style={{ display: "none" }}
            onChange={(e) => sendMessage(e.target.files[0])}
            />
            <button onClick={() => sendMessage(null)}>➤</button>
            </div>
          </>
        ) : (
          <p className="select-chat">Select a chat to start messaging</p>
        )}
      </div>

      {/*chat list */}
            <div className="chat-list">
            <div className="chat-search">
                <input
                type="text"
                placeholder="🔍 Search user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {/* ✅ قائمة نتائج البحث */}
                {searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((user) => (
                    <div key={user.id} className="search-item" onClick={() => handleUserSelect(user)}>
                        <p><strong>{user.firstName} {user.lastName}</strong></p>
                        <p>{user.email} - {user.phone}</p>
                    </div>
                    ))}
                </div>
                )}
            </div>

            {chats.map((chat) => (
            <div key={chat.id} className="chat-item" onClick={() => loadMessages(chat.id)}>
                <div className="chat-user-info">
                <div className="user-avatar">
                    <Avatar>
                    <PersonIcon />
                    </Avatar>
                </div>
                <div className="user-details">
                    <p className="user-name">
                    {chat.userName} {/*show name*/}
                    </p>
                    <span className="last-message">{chat.lastMessage}</span> {/*last message */}
                </div>
                </div>
            </div>
            ))}
            </div>
    </div>
  </div>
  );
};
export default ChatPage; 










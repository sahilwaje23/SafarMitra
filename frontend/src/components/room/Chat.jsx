import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Paper, TextField, Button, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SocketContext } from "../../contexts/Socket";
import { EntityContext } from "../../contexts/EntityContext";
import { useRoom } from "../../contexts/RoomContext";

// use local storage or some light weight database to persist messages 
function Chat() {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  
  const { sendMessage, recieveMessage } = useContext(SocketContext);
  const { entity } = useContext(EntityContext);
  const { roomid } = useRoom();

  const currentUserId = entity?._id || JSON.parse(localStorage.getItem("USER"))?._id || JSON.parse(localStorage.getItem("DRIVER"))?._id;
  const currentUserName = entity?.fullName || JSON.parse(localStorage.getItem("USER"))?.fullName || JSON.parse(localStorage.getItem("DRIVER"))?.fullName || "User";

  // Load messages from sessionStorage when the component mounts
  useEffect(() => {
    const storedMessages = sessionStorage.getItem(`messages_${roomid}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [roomid]);

  useEffect(() => {
    recieveMessage("new-chat", (data) => {
      setMessages((prev) => {
        const newMsgs = [...prev, data];
        sessionStorage.setItem(`messages_${roomid}`, JSON.stringify(newMsgs));
        return newMsgs;
      });
    });
  }, [roomid, recieveMessage]);

  // Scroll to the bottom of the messages container when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Save messages to sessionStorage whenever the messages array changes
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`messages_${roomid}`, JSON.stringify(messages));
    }
  }, [messages, roomid]);

  const handleSend = () => {
    if (input.trim()) {
      const msgData = {
        message: input,
        senderId: currentUserId,
        senderName: currentUserName,
        timestamp: new Date().toISOString()
      };
      // Optimistically add to UI
      setMessages([...messages, msgData]);
      
      // Send over socket
      sendMessage("send-message", {
        rideId: roomid,
        ...msgData
      });
      setInput("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the default action (e.g., adding a newline)
      handleSend();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        ptop: 2,
        bgcolor: theme.palette.mode === "dark" ? "rgba(18, 18, 18, 0.9)" : "rgba(255, 255, 255, 0.9)",
        gap: '0.8rem',
        borderRadius: 2,
      }}
    >
      {/* Chat Messages Section */}
      <Box
        sx={{

          minHeight:'20rem',
          maxHeight:'22rem',
          pt:'4rem',
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1,
          border: `1px solid ${theme.palette.primaryColor.main}`,
          borderRadius: 2,
        }}
      >
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <Box key={index} sx={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 1, mb: 1 }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: isMe ? theme.palette.primaryColor.main : 'gray' }}>
                {msg.senderName?.charAt(0) || "U"}
              </Avatar>
              <Box sx={{ maxWidth: '70%' }}>
                <Typography variant="caption" sx={{ color: 'gray', ml: isMe ? 0 : 1, mr: isMe ? 1 : 0, display: 'block', textAlign: isMe ? 'right' : 'left' }}>
                  {isMe ? "You" : msg.senderName}
                </Typography>
                <Typography
                  sx={{
                    bgcolor: isMe ? theme.palette.primaryColor.main : theme.palette.tbgcolor,
                    color: isMe ? 'black' : theme.palette.txtcol,
                    p: 1.5,
                    borderRadius: 2,
                    wordWrap: "break-word",
                    fontSize: "0.9rem",
                  }}
                >
                  {msg.message}
                </Typography>
              </Box>
            </Box>
          );
        })}
        {/* Dummy div to ensure focus on the latest message */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input and Send Button Section */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Add the keydown event listener
          placeholder="Type your message..."
          variant="outlined"
        />
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{
            fontWeight: 'bold',
            bgcolor: theme.palette.secondaryColor.main,
            "&:hover": {
              bgcolor: theme.palette.secondaryColor.hover,
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
}

export default Chat;
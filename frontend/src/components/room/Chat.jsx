import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// use local storage or some light weight database to persist messages 
function Chat() {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Load messages from sessionStorage when the component mounts
  useEffect(() => {
    const storedMessages = sessionStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Scroll to the bottom of the messages container when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Save messages to sessionStorage whenever the messages array changes
  useEffect(() => {
    sessionStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, `You: ${input}`]); // Name: Message format
      setInput(""); // Clear input field
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
        gap: 2,
        borderRadius: 2,
      }}
    >
      {/* Chat Messages Section */}
      <Box
        sx={{
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
        {messages.map((msg, index) => (
          <Typography
            key={index}
            sx={{
              alignSelf: "flex-start",
              bgcolor: theme.palette.tbgcolor,
              color: theme.palette.txtcol,
              p: 1,
              borderRadius: 2,
              maxWidth: "70%",
              wordWrap: "break-word",
              fontSize: "0.9rem",
            }}
          >
            {msg}
          </Typography>
        ))}
        {/* Dummy div to ensure focus on the latest message */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input and Send Button Section */}
      <Box sx={{ display: "flex", gap: 2 }}>
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

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, Menu, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generatedReply, setGeneratedReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try{
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });

      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    }
    catch(err){
      setError("Failed to generate reply. Please try again.");
      console.error(err);
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Typography variant="h4" component="h1" gutterBottom>
        Smart Email Writer
      </Typography>

      <Box sx={{mx: 3}}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{mb: 2}}
        />
        <FormControl fullWidth sx={{mb: 2}}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select 
          onChange={(e) => setTone(e.target.value)}
          value={tone || ''} 
          label={"Tone (Optional)"}>
            <MenuItem value={""}>None</MenuItem>
            <MenuItem value={"professional"}>Professional</MenuItem>
            <MenuItem value={"casual"}>Casual</MenuItem>
            <MenuItem value={"friendly"}>Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button 
        onClick={handleSubmit}
        disabled={isLoading || !emailContent}
        fullWidth
        variant="contained">
          {isLoading ? <CircularProgress size={24} /> : "Generate Reply"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{mb: 2}}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{mt: 3}}>
          <Typography variant="h6" gutterBottom>
            Generated Reply:
          </Typography>
          <TextField 
          multiline
          rows={6}
          value={generatedReply || ''}
          variant="outlined"
          inputProps={ { readOnly: true } }
          fullWidth/>

          <Button
          variant='outlined'
          sx={{mt: 2}}
          onClick={() => {
            navigator.clipboard.writeText(generatedReply);
          }}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default App

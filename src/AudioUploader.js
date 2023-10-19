import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

//NOTE: Ive been getting rate limited anytime I try to use the open ai api's. I think this work tho...

//function using open ai api to transcribe from given audio file

async function transcribeAudio(file) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        file,
        model: 'whisper-1'
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          //usage Authorization: `Bearer 34234` given 34234 is your api key
          Authorization: `Bearer APIKEY`
       
         
        }
      }
    );
    console.log(response.data)
    return response.data.text;
  } catch (error) {
    console.error('Transcription failed:', error);
    throw error;
  }
}

//gets an audio file

function AudioUploader() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcription, setTranscription] = useState('');

  const onDrop = async (acceptedFiles) => {
    const audioFile = acceptedFiles[0];
    if (audioFile) {
      setAudioUrl(URL.createObjectURL(audioFile));

      try {
        const transcript = await transcribeAudio(audioFile);

        if (transcript) {
          setTranscription(transcript);
        }
      } catch (error) {
        console.error(error);
        setTranscription('Transcription failed');
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.mp3, .wav, .aac',
  });
//front end
  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Click this text to upload audio</p>
      </div>
      {audioUrl && <audio controls src={audioUrl}></audio>}
      {transcription && <div>Transcription: {transcription}</div>}
    </div>
  );
}

export default AudioUploader;
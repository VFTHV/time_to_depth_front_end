import React, { useState } from 'react';
import { LasFileReader } from './logics/LasFileReader';

function FileProcessor() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputFile, setOutputFile] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setInputFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputFile) {
      alert('Please select a file');
    } else {
      const reader = new LasFileReader(inputFile);
      reader.read();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Input File:
        <input type="file" onChange={handleFileChange} />
      </label>
      <br />
      <label>
        Output File:
        <input
          type="text"
          value={outputFile}
          onChange={(e) => setOutputFile(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Process File</button>
    </form>
  );
}

export default FileProcessor;

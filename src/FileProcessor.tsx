import React, { useState } from 'react';
import { LasFileReader } from './logics/LasFileReader';

function FileProcessor() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [step, setStep] = useState(0);
  const [resampleDisabled, setResampleDisabled] = useState(true);

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
      const reader = new LasFileReader(inputFile, fileName, step);
      reader.read();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Input File:
        <input type="file" onChange={handleFileChange} accept=".las" />
      </label>
      <br />
      <label>
        Output File Name (not mandatory):
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Resample data between depth points?
        <input
          type="checkbox"
          checked={resampleDisabled}
          onChange={() => setResampleDisabled(!resampleDisabled)}
        />
      </label>
      <br />
      <label>
        Set depth distance between samples to resample and interpolate the data
        (not mandatory):
        <input
          type="number"
          value={step}
          onChange={(e) => setStep(parseFloat(e.target.value))}
          disabled={!resampleDisabled}
        />
      </label>
      <br />
      <button type="submit">Process File</button>
    </form>
  );
}

export default FileProcessor;

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Modal, Typography, Button, LinearProgress } from '@mui/material';
import { Close, UploadFileOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';
import './FileUpload.css';
import { modalStyle } from '../../constants/styles';
import axios from 'axios';

function FileUpload({ openModal, setOpenModal, setBluePrints }) {
  const [files, setFiles] = React.useState([]);
  const [fileNames, setFileNames] = React.useState([]);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [showProgress, setShowProgress] = React.useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
    const newFileNames = acceptedFiles.map((file) => file.name);
    setFileNames([...fileNames, ...newFileNames]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUploadClick = async () => {
    if (files.length === 0) return;
    setShowProgress(true);
    const file = files[0];
    var formData = new FormData();
    formData.append('blueprintManifest', file);
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': localStorage.getItem('jwt_token'),
    };
    try {
      const uploadedFiles = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('blueprintManifest', file);
        const response = await axios.post('http://localhost:5001/blueprints/', formData, { headers }, {
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(progress);
          },
        });
        uploadedFiles.push(file);
        setBluePrints((bluePrints) => [...bluePrints, {
          id: response.data.id,
          blueprintName: response.data.blueprintName,
        }]);
      }
      setUploadProgress(0);
      setShowProgress(false);
      setFiles([]);
      setFileNames([]);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClose = () => {
    setFiles([]);
    setFileNames([]);
    setOpenModal(false);
  };

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
    >
      <Box sx={modalStyle}>
        <div className='flex justify-between items-center mb-4'>
          <Typography variant='h5' style={{ fontWeight: 'bold'}}>Upload File</Typography>
          <Close onClick={handleClose} className='cursor-pointer' />
        </div>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <>
              <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <UploadFileOutlined style={{ fontSize: '50px' }} />
                <Typography style={{ padding: '10px' }}>Drag and drop some files here, or click to select files</Typography>
                {fileNames.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">Selected files:</Typography>
                    <ul>
                      {fileNames.map((name) => (
                        <li key={name}>
                          <Typography variant="body2">{name}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
                {showProgress && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} sx={{ color: 'primary.main' }} />
                  </Box>
                )}
              </Box>
            </>
          )}
        </div>
        <Box className='flex  items-center mt-10' style={{ justifyContent: 'flex-end' }}>
          <Button style={{ backgroundColor: 'primary.contrastText' }} onClick={handleUploadClick}>
            Upload
          </Button>
        </Box>
      </Box>
    </Modal>

  );
}
FileUpload.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  setBluePrints: PropTypes.func.isRequired,
};
export default FileUpload;

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
// import { makeRequest } from '../../utils';
// import { apiEndPoints } from '../../constants';
// import { useParams } from 'react-router';

function ServiceName({ service, handleNameChange, serviceValue, setServiceValue, isEditable, setIsEditable}) {
  // const [isEditable, setIsEditable] = useState(false);
  // const [serviceValue, setServiceValue] = useState(service);
  // const token= localStorage.getItem('jwt_token');
  // const { blueprintId, version } = useParams();
  // const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setServiceValue(service);
  }, [service]);

  // const handleNameChange = async () => {
  //   setIsEditable(false);
  //   // setIsSaved(true);
  //   makeRequest.makeRequest(apiEndPoints.UPDATE_CONFIGURATIONS(blueprintId, serviceId, version), null , token, { data : { configurations: { name: { value: serviceValue}} }})
  //     .then(() => {
  //       setNodes((nds) =>
  //         nds.map((node) => {
  //           if (node.id === serviceId) {
  //             node.data = {
  //               ...node.data,
  //               label: serviceValue.toUpperCase(),
  //             };
  //           }
  //           return node;
  //         })
  //       );})
  //     .catch(() => {
  //       setServiceValue(service);
  //       setSnackbar({
  //         status: true,
  //         message: 'Service name already exists',
  //         type: 'error'
  //       });
  //     });
  // };

  return (
    <div className='service-element-border' onDoubleClick={() => setIsEditable(true)}>
      {isEditable ? (
        <TextField
          autoFocus
          className='w-[90%]'
          size='large'
          sx={{ fieldset: { borderColor: '#18CCCC'} ,input: { width:'100%', color: 'text.contrastText' ,border:'none',helperText:{color:'text.primary'}} }}
          value={ serviceValue.toLowerCase() }
          // onBlur = {() => {
          //   setIsEditable(false);
          //   // if (!isSaved) {
          //   //   setServiceValue(service);
          //   // }
          // }}
          InputProps={{
            endAdornment: (
              <DoneIcon
                data-testid='done-icon'
                sx={{ color: 'text.primary', fontSize: 20, cursor: 'pointer' }}
                onClick={() => handleNameChange()}
              />
            )}}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleNameChange();
            }
          }}
          onChange={(e) => {
            setServiceValue(e.target.value);
            // setIsSaved(false);
          }}
        />
      ) : (
        <div className='service-element'>{serviceValue}</div>
      )}
    </div>
  );
}

export default ServiceName;

ServiceName.propTypes = {
  service: PropTypes.string.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  serviceValue: PropTypes.string.isRequired,
  setServiceValue: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
  setIsEditable: PropTypes.func.isRequired
};
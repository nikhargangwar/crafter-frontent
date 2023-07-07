import React ,{ useEffect,useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DownloadButton from './downloadButton';
import CustomBadges from './customBadges';
import { makeRequest } from '../../utils';
import { apiEndPoints } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import './TaskTable.css';
import download from 'downloadjs';

// function createData(name, calories, fat, time, protein) {
//   return { name, calories, fat, time, protein };
// }


export default function Tasktable() {
  const navigate = useNavigate();
  const { blueprintId } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    console.log('Tasktable');
    makeRequest.makeRequest(apiEndPoints.GET_ALL_TASKS(), navigate, localStorage.getItem('jwt_token'),{ params: { blueprintId } }). then((response) => {
      console.log('response',response);
      setData(response);
    }
    );
  }, []);

  console.log('data1',data);
  const timeConverter = (seconds) => {
    let time='';
    if(seconds === -1) {
      return '--';
    }
    if(seconds <= 119){
      return 'less than a minute';
    }else{
      if(seconds >= 86400){
        let days = Math.floor(seconds / 86400);
        time += days + ' days ';
        seconds -= days * 86400;
      }else if(seconds >= 3600){
        let hours = Math.floor(seconds / 3600);
        time += hours + ' hours ';
        seconds -= hours * 3600;
        return time;
      }else if(seconds >= 120){
        let minutes = Math.floor(seconds / 60);
        time += minutes + ' minutes ';
        seconds -= minutes * 60;
        return time;
      }
      return time;
    }
  };

  const downloadBoilerplate = (url) => {
    const blueprintData = JSON.parse(url);
    makeRequest.makeRequest(apiEndPoints.DOWNLOAD_BOILERPLATE(blueprintData.objectName), navigate, localStorage.getItem('jwt_token'), {responseType: 'blob'}). then((response) => {
      download(response, blueprintData.objectName, 'application/zip');
    });  
  };


    
  return (
    <>
      <TableContainer className='Table-outline'>
        <Table className='Table-outline-interior' aria-label="Task table" component={Paper}>
          <TableHead className='table-outline-bottom'>
            <TableRow className='text-bold'>
              <TableCell><b>Name</b></TableCell>
              <TableCell align="centre"><b>Version</b></TableCell>
              <TableCell align="centre"><b>Types</b></TableCell>
              <TableCell align="centre"><b>Status</b></TableCell>
              <TableCell align="centre"><b>Expire In</b></TableCell>
              <TableCell align="centre"><b>Download</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.blueprintId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="centre" component="th" scope="row">
                  {row.blueprintName}
                </TableCell>
                <TableCell align="centre">{row.blueprintVersion}</TableCell>
                <TableCell align="centre">{row.type}</TableCell>
                <TableCell align="centre"><CustomBadges status={row.status}></CustomBadges></TableCell>
                <TableCell align="centre">{timeConverter(row.ttl)}</TableCell>
                {
                  row.type === 'blueprint-export'? <TableCell align="centre">
                    { row.status === 'completed' &&
                  <button onClick={() => downloadBoilerplate(row.url)}>
                    <DownloadButton/>
                  </button>

                    }
                  </TableCell>
                    :<TableCell align="centre">{}</TableCell>
                }
              
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
     
    </>
  );
}
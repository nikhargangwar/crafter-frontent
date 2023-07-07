import makeRequest from '..';
import axios from 'axios';
import { apiEndPoints } from '../../../constants/';
import { ERROR_ROUTE } from '../../../constants/routes';

jest.mock('axios');
describe('makeRequest',()=>{
  const mockData= {
    'services':[
      {
        'service_type': 'FrontEnd',
        'configurations':{
          'port':'5432',
          'numberOfReplicas':5,
          'name':'React Todo App'
        },
        'connected_service': ['Node Todo App'],
        'customEnv':{
          'port': '0000',
          'xyz': 'efgh'
        }
      },
      {
        'service_type': 'BackEnd',
        'configurations':{
          'port':'5432',
          'numberOfReplicas':5,
          'name':'Node Todo App'
        },
        'connected_service': ['React Todo App'],
        'customEnv':{
          'port': '002',
          'aaaa': 'efgh'
        }
      }   
    ]
  };
  it('should call axios api',async()=>{
    const mockNavigate = jest.fn();
    axios.mockResolvedValue({data:{mockData}});
    expect(axios).not.toBeCalled();
    const response = await makeRequest.makeRequest(apiEndPoints.GET_ALL_BLUEPRINTS,mockNavigate,'token',mockData );
    expect(axios).toHaveBeenCalledTimes(1);
    expect(response).toEqual({mockData});
  });
  it('should navigate to error page with status code when api call return error status code',async()=>{
    const mockNavigate = jest.fn();
    axios.mockRejectedValueOnce({response:{status:500}});
    expect(mockNavigate).not.toBeCalled();
    await makeRequest.makeRequest(apiEndPoints.GET_ALL_BLUEPRINTS,mockNavigate,'token',mockData );
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`${ERROR_ROUTE}/500`);
  });
  it('should navigate to error page without status code when api call return error status code' ,async()=>{
    const mockNavigate = jest.fn();
    axios.mockRejectedValueOnce({});
    expect(mockNavigate).not.toBeCalled();
    await makeRequest.makeRequest(apiEndPoints.SAVE_ENTERED_CONFIG,mockNavigate,'token',mockData );
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(ERROR_ROUTE);
  });
});
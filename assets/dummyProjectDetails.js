export const myProject = 
{
  'services':[
    {
      'service_type': 'FrontEnd',
      'configurations':{
        'port':'5432',
        'numberOfReplicas':5,
        'name':'fe1'
      },
      'connected_service': ['be1'],
      'customEnv':{
        'port': '8000',
        'xyz': 'efgh'
      },
      'imageRepository':{
        'repositoryImageAddress':'http://dockerhub.com',
        'username': 'ap',
        'email': 'a@gmail.com',
        'token':'rhx85#00913'
      }
    },
    {
      'service_type': 'FrontEnd',
      'configurations':{
        'port':'5432',
        'numberOfReplicas':5,
        'name':'fe2'
      },
      'connected_service': ['be1', 'db1'],
      'customEnv':{
        'port': '0001',
        'www': 'efgh'
      },
      'imageRepository':{
        'repositoryImageAddress':'http://dockerhub.com',
        'username': 'ap',
        'email': 'a@gmail.com',
        'token':'rhx85#00913'
      }
    },
    {
      'service_type': 'BackEnd',
      'configurations':{
        'port':'5432',
        'numberOfReplicas':5,
        'name':'be1'
      },
      'connected_service': ['fe1', 'fe2'],
      'customEnv':{
        'port': '002',
        'aaaa': 'efgh'
      },
      'imageRepository':{
        'repositoryImageAddress':'http://dockerhub.com',
        'username': 'ap',
        'email': 'a@gmail.com',
        'token':'rhx85#00913'
      }
    },
    {
      'service_type': 'Database',
      'configurations':{
        'port':'5432',
        'name': 'db1',
        'dbUser': 'postgres',
        'dbPassword': 'abcd',
        'numberOfReplicas':5,
        'schemaName': 'mckEmployees'
      },
      'connected_service': ['fe2'],
      'customEnv':{
        'port': '003',
        'bbbb': 'efgh'
      },
      'imageRepository':{
        'repositoryImageAddress':'http://dockerhub.com',
        'username': 'ap',
        'email': 'a@gmail.com',
        'token':'rhx85#00913'
      }
    },
    {
      'service_type': 'Database',
      'configurations':{
        'port':'5432',
        'name': 'db2',
        'dbUser': 'postgres',
        'dbPassword': 'abcd',
        'numberOfReplicas':5,
        'schemaName': 'mckEmployees'
      },
      'connected_service': ['be1','fe1'],
      'customEnv':{
        'port': '004',
        'sdf': 'gs'
      },
      'imageRepository':{
        'repositoryImageAddress':'http://dockerhub.com',
        'username': 'ap',
        'email': 'a@gmail.com',
        'token':'rhx85#00913'
      }
    }
  ]
};
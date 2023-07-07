const entryTypes = {
  userConfig :{
    FRONTEND:{
      port:'integer',
      numberOfReplicas : 'integer',
      name:'string',
    },
    BACKEND:{
      port:'integer',
      numberOfReplicas:'integer',
      name:'string',
    },
    DATABASE:{
      port:'integer',
      numberOfReplicas:'integer',
      dbUser:'string',
      dbPassword:'string',
      name:'string',
      schemaName :'string',
    }},
  dockerConfig:{
    username:'string',
    email:'e-mail',
    repositoryImageAddress : 'string',
    token:'string'},
};

export default entryTypes;

export  let REPOSITORY ={
  username:'',
  email:'',
  repositoryImageAddress : '',
  token:''
};
export const customReactFlow = {
  left:0,
  top:84,
};

let FRONTEND = {
  port:'',
  numberOfReplicas : '',
  name:''
};
let BACKEND = {
  port:'',
  numberOfReplicas:'',
  name:''
};
let DATABASE={
  port:'',
  numberOfReplicas:'',
  name:'',
  dbUser:'',
  dbPassword:'',
  schemaName :''
};

export function getSpaceSeparated(configurations){
  let spaceSeperatedConfig=  Object.keys(configurations).reduce((acc,configuration)=>{
    let spaceSeperated = configuration
      .replace(/([A-Z])/g,' $1')
      .split(' ')
      .map(word => word && word[0].toUpperCase() + word.slice(1))
      .join(' ');
    acc.push(spaceSeperated);
    return acc;
  },[]);
  return spaceSeperatedConfig;
}
export function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

export function getConfiguration(service){
  switch(service.split(' ')[0]){
  case 'FRONTEND':
    return FRONTEND;
  case 'BACKEND':
    return BACKEND;
  case 'DATABASE':
    return DATABASE;
  }
}

export function updateConfiguration(service,configuration){
  if(!service){
    REPOSITORY=configuration;
  }
  switch(service.split(' ')[0]){
  case 'FRONTEND':
    FRONTEND=configuration;
    break;
  case 'BACKEND':
    BACKEND=configuration;
    break;
  case 'DATABASE':
    DATABASE=configuration;
  }
}

export function getCustomEvent(serviceName){
  return {
    dataTransfer:{
      getData:(key)=>{
        if(key === 'application/reactflow'){
          return 'microservice';
        }else if(key === 'nameOfNode'){
          return serviceName;
        }
      }
    },
    clientX: getRandomCoordinates(-300,600,3),
    clientY: getRandomCoordinates(-300,600,3)
  };
}


export function getRandomCoordinates(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

export function convertKibanaToCapital(str) {
  let words = str.split('_');
  let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(' ');
}

export function convertCamelCaseToCapital(str) {
  let words = str.split(/(?=[A-Z])/);
  let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(' ');
}

export function separatePascalCase(str) {
  return str?.split(/(?=[A-Z])/).join(' ');
}

export function capitalizeEachWord(str) {
  return str?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const validateInteger = (input)=>{
  const integerRegex = /^[0-9]*$/;
  return integerRegex.test(input);
};

export default validateInteger;
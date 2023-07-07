const validateString = (input) => {
  const stringRegex = /^[a-z0-9/-]*$/;
  return stringRegex.test(input);
};   


export default validateString;
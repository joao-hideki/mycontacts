module.exports = (request, response, next) => {
  response.setHeader('Acess-Controll-Allow-Origin', 'http://localhost:3000');
  next();
};
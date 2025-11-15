// Importa a instância do Express que está configurada no arquivo app.js
const app = require('./app.js');

// Inicia o servidor HTTP e fica ouvindo na porta definida
app.listen(5002, () => {
    // Quando o servidor iniciar com sucesso, imprime essa mensagem no console
    console.log(`Servidor Express está ouvindo na porta 5002`);
});

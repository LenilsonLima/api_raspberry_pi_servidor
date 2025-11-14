const path = require('path');
// Módulo para manipulação de caminhos de arquivos
const { exec } = require('child_process');
// Para executar comandos e scripts externos
const { Gpio } = require('onoff');
// Biblioteca para controle de GPIO no Raspberry Pi

// Caminho absoluto do script que será executado ao pressionar o botão
const SCRIPT_PATH = path.resolve(__dirname, '../scripts/ativar_modo_ap_reboot.sh');

// Configura o GPIO 17 como entrada, detectando borda de descida (falling edge) com debounce de 10ms
const button = new Gpio(17, 'in', 'falling', { debounceTimeout: 10 });

let emExecucao = false;
// Flag para evitar múltiplas execuções simultâneas do script

console.log('Monitorando botão GPIO17...');

// Configura o "watch" para detectar eventos no botão (pressionamento)
button.watch((err, value) => {
  if (err) {
    // Caso erro ao ler o botão, grava no log e retorna sem executar nada
    console.log(`Erro ao ler botão: ${err.message}`);
    return;
  }

  // Se já houver execução em andamento, ignora novo acionamento e loga aviso
  if (emExecucao) {
    console.log('Script já em execução. Ignorando novo acionamento.');
    return;
  }

  emExecucao = true;
  // Sinaliza que o script está em execução
  console.log('Botão pressionado. Executando script...');

  // Executa o script shell configurado
  exec(`bash ${SCRIPT_PATH}`, (error, stdout, stderr) => {
    if (error) {
      // Loga erro caso tenha ocorrido
      console.log(`Erro ao executar script: ${error.message}`);
    }
    if (stderr) {
      // Loga qualquer saída de erro (stderr) do script
      console.log(`STDERR: ${stderr}`);
    }
    if (stdout) {
      // Loga a saída padrão (stdout) do script
      console.log(`STDOUT: ${stdout}`);
    }
    emExecucao = false;
    // Libera flag para permitir próximas execuções
  });
});

// Tratamento para encerramento do processo via CTRL+C
process.on('SIGINT', () => {
  button.unexport();
  // Libera o GPIO para uso futuro
  console.log('Encerrando monitoramento do botão...');
  process.exit();
  // Encerra o processo Node.js
});

const path = require('path');
const { exec } = require('child_process');
const { Gpio } = require('pigpio');

// Caminho absoluto do script a ser executado
const SCRIPT_PATH = path.resolve(__dirname, '../scripts/ativar_modo_ap_reboot.sh');

// GPIO17 como entrada com pull-up
const button = new Gpio(17, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
  alert: true
});

let emExecucao = false;

console.log('Monitorando botão GPIO17...');

// Configura detecção de borda
button.glitchFilter(10000); // 10ms debounce

button.on('alert', (level, tick) => {
  // level 0 = borda de descida = botão pressionado
  if (level === 0) {

    if (emExecucao) {
      console.log('Script já em execução. Ignorando novo acionamento.');
      return;
    }

    emExecucao = true;

    console.log("Botão pressionado! Executando script...");

    exec(`bash ${SCRIPT_PATH}`, (error, stdout, stderr) => {
      if (error) console.log("Erro ao executar script:", error.message);
      if (stderr) console.log("STDERR:", stderr);
      if (stdout) console.log("STDOUT:", stdout);

      emExecucao = false;
    });
  }
});

// Finalização limpa
process.on('SIGINT', () => {
  button.digitalWrite(0);
  console.log('Encerrando monitoramento do botão...');
  process.exit();
});
const path = require('path');
const { exec } = require('child_process');
const { Gpio } = require('pigpio');

// Caminho do script AP
const SCRIPT_PATH = path.resolve(__dirname, '../scripts/ativar_modo_ap_reboot.sh');

// GPIOs
const BUTTON_GPIO = 17;
const LED_GPIO = 22;

// Config LED
const led = new Gpio(LED_GPIO, { mode: Gpio.OUTPUT });

// Config botão
const button = new Gpio(BUTTON_GPIO, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
  alert: true,
});

// Debounce
button.glitchFilter(10000); // 10ms

let emExecucao = false;
let blinkInterval = null;

// Função para piscar LED
function startBlink() {
  let state = 0;
  blinkInterval = setInterval(() => {
    state ^= 1;
    led.digitalWrite(state);
  }, 500);
}

// Parar piscar LED
function stopBlink() {
  clearInterval(blinkInterval);
  led.digitalWrite(0);
}

console.log('Monitorando botão GPIO17...');

// Quando botão for pressionado
button.on('alert', (level) => {
  if (level === 0) {
    if (emExecucao) {
      console.log('Script já em execução. Ignorando...');
      return;
    }

    emExecucao = true;
    console.log("Botão pressionado! Iniciando modo AP...");

    startBlink();

    exec(`bash ${SCRIPT_PATH}`, (error, stdout, stderr) => {
      if (error) console.log("Erro ao executar script:", error.message);
      if (stderr) console.log("STDERR:", stderr);
      if (stdout) console.log("STDOUT:", stdout);

      stopBlink();
      emExecucao = false;
    });
  }
});

// CTRL+C
process.on('SIGINT', () => {
  stopBlink();
  console.log('Encerrando monitoramento do botão...');
  process.exit();
});
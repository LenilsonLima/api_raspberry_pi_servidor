
const path = require('path');

const { spawn } = require('child_process');

exports.ativarModoAPComReboot = (req, res) => {
  try {
    const scriptPath = path.resolve(__dirname, '../scripts/ativar_modo_ap_reboot.sh');

    res.status(200).json({
      retorno: {
        status: 200,
        mensagem: 'O modo AP com reboot está sendo ativado. A operação pode levar alguns segundos.'
      },
      registros: []
    });

    // Executa o script em segundo plano
    const child = spawn('sudo', [scriptPath], {
      detached: true,   // garante que continue rodando mesmo se o servidor reiniciar
      stdio: 'ignore'   // não bloqueia o servidor com saída do script
    });

    child.unref(); // libera o processo principal do Node

    console.log(`[INFO] ativar_modo_ap_reboot.sh iniciado em segundo plano.`);

  } catch (error) {
    console.error("Erro ao iniciar ativar_modo_ap_reboot.sh:", error);
    return res.status(500).json({
      retorno: {
        status: 500,
        mensagem: "Erro ao ativar modo AP com reboot.",
      },
      registros: []
    });
  }
};
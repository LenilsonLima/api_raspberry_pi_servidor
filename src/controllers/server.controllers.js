const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

exports.ativarModoAPComRebootServer = (req, res) => {
  try {
    const scriptPath = path.resolve(__dirname, '../scripts/ativar_modo_ap_reboot.sh');

    // Verifica se o script existe
    if (!fs.existsSync(scriptPath)) {
      console.error(`[ERRO] Script não encontrado em: ${scriptPath}`);
      return res.status(500).json({
        retorno: {
          status: 500,
          mensagem: "Script de ativação não encontrado no servidor."
        },
        registros: []
      });
    }

    // Retorna imediatamente ao cliente
    res.status(200).json({
      retorno: {
        status: 200,
        mensagem: 'O modo AP com reboot está sendo ativado. A operação pode levar alguns segundos.'
      },
      registros: []
    });

    // Executa o script em segundo plano
    const child = spawn(scriptPath, [], {
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore']
    });

    child.on('error', (err) => {
      console.error("[ERRO] Falha ao executar script:", err);
    });

    child.unref();

    console.log(`[INFO] Script iniciado em segundo plano: ${scriptPath}`);

  } catch (error) {
    console.error("[ERRO] Erro inesperado ao iniciar ativar_modo_ap_reboot.sh:", error);

    return res.status(500).json({
      retorno: {
        status: 500,
        mensagem: "Erro ao ativar modo AP com reboot."
      },
      registros: []
    });
  }
};
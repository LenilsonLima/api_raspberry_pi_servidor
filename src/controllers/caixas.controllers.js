const axios = require("axios");

exports.ativarModoAPReboot = async (req, res) => {
    try {
        const { identificador_balanca } = req.query;

        if (!identificador_balanca) {
            return res.status(400).send({
                retorno: {
                    status: 400,
                    mensagem: 'Parâmetro identificador_balanca é obrigatório.'
                },
                registros: []
            });
        }

        const url = `http://raspberrypi-${encodeURIComponent(identificador_balanca)}.local:5002/raspberry/mode-ap-reboot`;

        const response = await axios.get(url, { timeout: 5000 }); // Timeout de 5 segundos

        res.status(200).send({
            retorno: response.data.retorno,
            registros: response.data.registros
        });
    } catch (error) {
        console.error("Erro ao realizar ação, tente novamente:", error.message);

        res.status(500).send({
            retorno: {
                status: 500,
                mensagem: 'Erro ao realizar ação, tente novamente.'
            },
            registros: []
        });
    }
};

exports.tararBalanaca = async (req, res) => {
    try {
        const { identificador_balanca } = req.query;

        if (!identificador_balanca) {
            return res.status(400).send({
                retorno: {
                    status: 400,
                    mensagem: 'Parâmetro identificador_balanca é obrigatório.'
                },
                registros: []
            });
        }

        const url = `http://raspberrypi-${encodeURIComponent(identificador_balanca)}.local:5002/raspberry/tarar`;

        const response = await axios.get(url, { timeout: 5000 }); // Timeout de 5 segundos

        res.status(200).send({
            retorno: response.data.retorno,
            registros: response.data.registros
        });
    } catch (error) {
        console.error("Erro ao realizar ação, tente novamente:", error.message);

        res.status(500).send({
            retorno: {
                status: 500,
                mensagem: 'Erro ao realizar ação, tente novamente.'
            },
            registros: []
        });
    }
};
const axios = require("axios");

/**
 * Utilitário para montar a URL padrão do Raspberry
 */
function buildRaspberryUrl(id, port, path) {
    return `http://raspberrypi-${encodeURIComponent(id)}.local:${port}${path}`;
}

/**
 * Tratamento padronizado de erros Axios
 */
function handleAxiosError(error, res) {
    const networkErrors = [
        "ENOTFOUND",
        "ECONNREFUSED",
        "ETIMEDOUT",
        "EHOSTUNREACH",
        "ECONNRESET"
    ];

    const code = error.code;

    console.error("Erro axios:", code, error.message);

    if (networkErrors.includes(code)) {
        return res.status(500).send({
            retorno: {
                status: 500,
                mensagem: `Não foi possível acessar o dispositivo: ${code}. Verifique se o Raspberry está ligado e na mesma rede.`
            },
            registros: []
        });
    }

    console.log(error.response.data);
    
    return res.status(500).send({
        retorno: {
            status: 500,
            mensagem: error.response?.data?.retorno?.mensagem || "Erro ao realizar ação, tente novamente."
        },
        registros: []
    });
}

/* -------------------------------------------------------------------------- */
/*                          ATIVAR MODO AP + REBOOT                           */
/* -------------------------------------------------------------------------- */

exports.ativarModoAPReboot = async (req, res) => {
    try {
        const { identificador_balanca } = req.query;

        if (!identificador_balanca) {
            return res.status(400).send({
                retorno: {
                    status: 400,
                    mensagem: "Parâmetro identificador_balanca é obrigatório."
                },
                registros: []
            });
        }

        const url = buildRaspberryUrl(identificador_balanca, 5002, "/raspberry/modo-ap-reboot");

        const response = await axios.get(url, { timeout: 5000 });

        res.status(200).send(response.data);

    } catch (error) {
        handleAxiosError(error, res);
    }
};

/* -------------------------------------------------------------------------- */
/*                                TARAR BALANÇA                               */
/* -------------------------------------------------------------------------- */

exports.tararBalanaca = async (req, res) => {
    try {
        const { identificador_balanca } = req.query;

        if (!identificador_balanca) {
            return res.status(400).send({
                retorno: {
                    status: 400,
                    mensagem: "Parâmetro identificador_balanca é obrigatório."
                },
                registros: []
            });
        }

        const url = buildRaspberryUrl(identificador_balanca, 5001, "/tarar-balanca");

        const response = await axios.get(url, { timeout: 5000 });

        res.status(200).send(response.data);

    } catch (error) {
        handleAxiosError(error, res);
    }
};

/* -------------------------------------------------------------------------- */
/*                        CALIBRAR PESO DE REFERÊNCIA                          */
/* -------------------------------------------------------------------------- */

exports.calibrarReferenceBalanaca = async (req, res) => {
    try {
        const { identificador_balanca, peso_conhecido } = req.query;

        if (!identificador_balanca || !peso_conhecido) {
            return res.status(400).send({
                retorno: {
                    status: 400,
                    mensagem: "Dados obrigatórios não informados, tente novamente."
                },
                registros: []
            });
        }

        const url = buildRaspberryUrl(identificador_balanca, 5001, "/calibrar-reference");

        const response = await axios.post(
            url,
            { peso_conhecido },
            { headers: { "Content-Type": "application/json" }, timeout: 5000 }
        );

        res.status(200).send(response.data);

    } catch (error) {
        handleAxiosError(error, res);
    }
};

/* -------------------------------------------------------------------------- */
/*                           REINICIAR RASPBERRY PI                            */
/* -------------------------------------------------------------------------- */

exports.reiniciarRaspberry = async (req, res) => {
    try {
        const { identificador_balanca } = req.query;

        if (!identificador_balanca) {
            return res.status(400).send({
                retorno: {
                    status: 400,
                    mensagem: "Dados obrigatórios não informados, tente novamente."
                },
                registros: []
            });
        }

        const url = buildRaspberryUrl(identificador_balanca, 5002, "/raspberry/reiniciar");

        const response = await axios.get(url, { timeout: 5000 });

        res.status(200).send(response.data);

    } catch (error) {
        handleAxiosError(error, res);
    }
};
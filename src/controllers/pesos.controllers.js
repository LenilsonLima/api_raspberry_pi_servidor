const axios = require("axios");

exports.createPesoCaixa = async (req, res, next) => {
    try {
        let { peso_atual, identificador_balanca, tipo_peso } = req.body;
        tipo_peso = tipo_peso ?? 0;

        // Validação básica
        if (!identificador_balanca || peso_atual == null) {
            return res.status(400).send({
                retorno: {
                    status: 400,
                    mensagem: "Campos obrigatórios ausentes: peso_atual ou identificador_balanca."
                },
                registros: []
            });
        }

        const body = {
            peso_atual,
            identificador_balanca,
            tipo_peso
        };

        try {
            await axios.post(
                "https://api-pesagem-chi.vercel.app/peso-caixa",
                body,
                { headers: { "Content-Type": "application/json" } }
            );

        } catch (error) {
            console.error("Erro ao enviar para API externa:", error.response?.data || error.message);

            return res.status(500).send({
                retorno: {
                    status: 500,
                    mensagem: error?.response?.data?.retorno?.mensagem || "Erro ao criar registro de peso na API externa."
                },
                registros: []
            });
        }

        // Sucesso
        return res.status(201).send({
            retorno: { status: 201, mensagem: "Seu registro foi cadastrado com sucesso." },
            registros: []
        });

    } catch (error) {
        console.error("Erro inesperado:", error);

        return res.status(500).send({
            retorno: {
                status: 500,
                mensagem: "Erro ao cadastrar registro, tente novamente.",
                erro: error.message
            },
            registros: []
        });
    }
};
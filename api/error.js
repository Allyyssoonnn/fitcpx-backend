const router = require('express').Router();

router.post("/log-error", (req, res) => {
    const { error, stack } = req.body;
    console.error("Erro no frontend:", error, stack);
  
    // Aqui você pode salvar no banco de dados ou enviar para um serviço de logs
  
    res.status(200).send({ message: "Erro registrado" });
});

module.exports = router;
const router = require("express").Router();
const verifyToken = require("../middlewares/authMiddleware");
const { criarPagamentoAluno, buscarCobrancaAluno, marcarCobrancaRecebida } = require("../controllers/ctrlPagamento");

router.post("/criarPagamentoAluno", verifyToken, criarPagamentoAluno);
router.post("/buscarCobrancaAluno", verifyToken, buscarCobrancaAluno);
router.post("/marcarCobrancaRecebida", verifyToken, marcarCobrancaRecebida);

module.exports = router;

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      //tab_aluno
      await queryInterface.removeColumn("tab_aluno", "dev_stripe_id");
      await queryInterface.removeColumn("tab_aluno", "stripe_id");
      await queryInterface.removeColumn("tab_aluno", "payment_stripe_id");
      await queryInterface.removeColumn("tab_aluno", "dev_payment_stripe_id");
      //tab_modalidade
      await queryInterface.removeColumn("tab_modalidade", "stripe_product_id");
      await queryInterface.removeColumn("tab_modalidade", "stripe_price_id");
      await queryInterface.removeColumn("tab_modalidade", "dev_stripe_product_id");
      await queryInterface.removeColumn("tab_modalidade", "dev_stripe_price_id");
      //tab_modalidade_variacao
      await queryInterface.removeColumn("tab_modalidade_variacao", "stripe_product_id");
      await queryInterface.removeColumn("tab_modalidade_variacao", "dev_stripe_product_id");
      await queryInterface.removeColumn("tab_modalidade_variacao", "stripe_price_id");
      await queryInterface.removeColumn("tab_modalidade_variacao", "dev_stripe_price_id");
      //tab_modalidade_variacao_valor
      await queryInterface.removeColumn("tab_modalidade_variacao_valor", "stripe_price_id");
      await queryInterface.removeColumn("tab_modalidade_variacao_valor", "dev_stripe_price_id");
      //tab_empresa_licenca_pagamento
      await queryInterface.removeColumn("tab_empresa_licenca_pagamento", "stripe_payment_id");
      await queryInterface.removeColumn("tab_empresa_licenca_pagamento", "dev_stripe_payment_id");
      await queryInterface.removeColumn("tab_empresa_licenca_pagamento", "stripe_refund_id");
      await queryInterface.removeColumn("tab_empresa_licenca_pagamento", "dev_stripe_refund_id");
      //tab_aluno_sessao_pacote
      await queryInterface.removeColumn("tab_aluno_sessao_pacote", "dev_stripe_payment_id");
      await queryInterface.removeColumn("tab_aluno_sessao_pacote", "stripe_payment_id");
      await queryInterface.removeColumn("tab_aluno_sessao_pacote", "dev_stripe_refund_id");
      await queryInterface.removeColumn("tab_aluno_sessao_pacote", "stripe_refund_id");
      //tab_aluno_contrato_pagamento
      await queryInterface.removeColumn("tab_aluno_contrato_pagamento", "dev_stripe_payment_id");
      await queryInterface.removeColumn("tab_aluno_contrato_pagamento", "stripe_payment_id");
      await queryInterface.removeColumn("tab_aluno_contrato_pagamento", "dev_stripe_refund_id");
      await queryInterface.removeColumn("tab_aluno_contrato_pagamento", "stripe_refund_id");
      //tab_usuario
      await queryInterface.removeColumn("tab_usuario", "stripe_id");
      await queryInterface.removeColumn("tab_usuario", "dev_stripe_id");
      await queryInterface.removeColumn("tab_usuario", "stripe_account_id");
      await queryInterface.removeColumn("tab_usuario", "dev_stripe_account_id");
      //tab_licenca
      await queryInterface.removeColumn("tab_licenca", "stripe_product_id");
      await queryInterface.removeColumn("tab_licenca", "stripe_price_id");
      await queryInterface.removeColumn("tab_licenca", "dev_stripe_product_id");
      await queryInterface.removeColumn("tab_licenca", "dev_stripe_price_id");
      //tab_empresa
      await queryInterface.removeColumn("tab_empresa", "stripe_customer_id");
      await queryInterface.removeColumn("tab_empresa", "dev_stripe_customer_id");
      await queryInterface.removeColumn("tab_empresa", "stripe_id");
      await queryInterface.removeColumn("tab_empresa", "dev_stripe_id");
   },

   async down(queryInterface, Sequelize) {},
};

'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Ler o JSON
    const dataPath = path.resolve(__dirname, '../data/role_permissions.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // 2. Pegar todas as roles do banco para mapear nome -> id
    const roles = await queryInterface.sequelize.query(
      'SELECT id, name FROM roles',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Mapeia role name para id
    const roleMap = {};
    roles.forEach(r => {
      roleMap[r.name] = r.id;
    });

    // 3. Montar array para bulkInsert na tabela role_permissions
    const rolePermissions = [];

    jsonData.forEach(roleEntry => {
      const roleId = roleMap[roleEntry.role];
      if (!roleId) {
        throw new Error(`Role não encontrada no banco: ${roleEntry.role}`);
      }

      roleEntry.permissions.forEach(perm => {
        rolePermissions.push({
          role_id: roleId,
          name: perm.name,
          can_view: perm.can_view,
          can_create: perm.can_create,
          can_update: perm.can_update,
          can_delete: perm.can_delete,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    });

    // 4. Inserir no banco
    return queryInterface.bulkInsert('role_permissions', rolePermissions);
  },

  async down(queryInterface, Sequelize) {
    // Opcional: remover as permissões inseridas
    return queryInterface.bulkDelete('role_permissions', null, {});
  }
};
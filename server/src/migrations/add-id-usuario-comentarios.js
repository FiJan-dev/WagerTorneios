// Migration: Adicionar id_usuario na tabela comentarios
const sequelize = require('../config/database');

async function migrate() {
  try {
    console.log('Adicionando coluna id_usuario na tabela comentarios...');
    
    await sequelize.query(`
      ALTER TABLE comentarios 
      ADD COLUMN IF NOT EXISTS id_usuario INT(11) NULL,
      ADD KEY idx_id_usuario (id_usuario),
      ADD CONSTRAINT fk_comentarios_usuario 
        FOREIGN KEY (id_usuario) 
        REFERENCES olheiro(id_usuario) 
        ON DELETE SET NULL
    `);
    
    console.log('✅ Migração concluída com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro na migração:', err);
    process.exit(1);
  }
}

migrate();

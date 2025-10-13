// Teste rápido para verificar partidas no banco
// Execute: node test-partidas.js

require("dotenv").config();
const sequelize = require('./src/config/database');
const Partida = require('./src/models/Partida');
const Campeonato = require('./src/models/Campeonato');
const Time = require('./src/models/Time');

async function testPartidas() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida');

    // Listar todas as partidas
    const partidas = await Partida.findAll({
      include: [
        { model: Campeonato, attributes: ['nome_campeonato'] },
        { model: Time, as: 'timeCasa', attributes: ['nome_time'] },
        { model: Time, as: 'timeVisitante', attributes: ['nome_time'] },
      ]
    });

    console.log(`\n📋 Total de partidas encontradas: ${partidas.length}`);
    
    partidas.forEach((partida, index) => {
      console.log(`\n${index + 1}. ID: ${partida.id_partida}`);
      console.log(`   Campeonato: ${partida.Campeonato?.nome_campeonato}`);
      console.log(`   Casa: ${partida.timeCasa?.nome_time}`);
      console.log(`   Visitante: ${partida.timeVisitante?.nome_time}`);
      console.log(`   Data: ${partida.data_partida}`);
      console.log(`   Local: ${partida.local_partida}`);
    });

    // Testar busca por ID específico
    if (partidas.length > 0) {
      const primeiraPartida = partidas[0];
      console.log(`\n🔍 Testando busca por ID ${primeiraPartida.id_partida}:`);
      
      const partidaEncontrada = await Partida.findByPk(primeiraPartida.id_partida);
      console.log(`   Encontrada: ${partidaEncontrada ? 'SIM' : 'NÃO'}`);
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await sequelize.close();
  }
}

testPartidas();
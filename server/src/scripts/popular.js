const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Jogador, Time, Estatisticas } = require('../models');
const sequelize = require('../config/database');

const DATA_DIR = path.join(__dirname, '../data/raw');
const RODADAS = Array.from({ length: 20 }, (_, i) => i + 1);

const POSICOES = {
  1: 'GOL', 2: 'LAT', 3: 'ZAG', 4: 'MEI', 5: 'ATA', 6: 'TEC'
};

async function processarRodadaLocal(rodada, t) {
  const filePath = path.join(DATA_DIR, `rodada-${rodada}.csv`);
  if (!fs.existsSync(filePath)) {
    console.log(`Rodada ${rodada}: arquivo não encontrado (pula)`);
    return;
  }

  console.log(`Lendo rodada ${rodada} localmente...`);
  const records = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const nomeJogador = row['atletas.nome']?.trim();
          const nomeTime = row['atletas.clube.id.full.name']?.trim();
          const posicaoId = parseInt(row['atletas.posicao_id']);

          if (!nomeJogador || !nomeTime) return;

          records.push({
            nome_jogador: nomeJogador,
            posicao_jogador: POSICOES[posicaoId] || 'Indefinido',
            nome_time: nomeTime,
            idade: row['atletas.idade'] ? parseInt(row['atletas.idade']) : null,
            passes_certos: parseInt(row['PS'] || 0),
            finalizacoes: parseInt(row['FC'] || 0),
            gols_marcados: parseInt(row['G'] || 0),
            assistencias: parseInt(row['A'] || 0),
            cartoes_amarelos: parseInt(row['CA'] || 0),
            cartoes_vermelhos: parseInt(row['CV'] || 0),
            roubadas_bola: parseInt(row['DS'] || 0),
            aceleracao: parseInt(row['SG'] || 0),
            chute_forca: parseInt(row['FF'] || 0),
            passe_total: parseInt(row['PC'] || 0),
            drible: parseInt(row['DP'] || 0),
          });
        } catch (err) {
          console.warn(`Erro na linha da rodada ${rodada}:`, err.message);
        }
      })
      .on('end', async () => {
        console.log(`Rodada ${rodada}: ${records.length} linhas lidas.`);

        for (const r of records) {
          let time = await Time.findOne({ where: { nome_time: r.nome_time }, transaction: t });
          if (!time) {
            time = await Time.create({ nome_time: r.nome_time, cidade_time: 'A definir' }, { transaction: t });
          }

          let jogador = await Jogador.findOne({ where: { nome_jogador: r.nome_jogador }, transaction: t });
          if (!jogador) {
            jogador = await Jogador.create({
              nome_jogador: r.nome_jogador,
              posicao_jogador: r.posicao_jogador,
              id_time: time.id_time,
              idade: r.idade,
            }, { transaction: t });
          }

          const stats = await Estatisticas.findOne({ where: { id_jogador: jogador.id_jogador }, transaction: t });
          const novos = {
            passes_certos: (stats?.passes_certos || 0) + r.passes_certos,
            finalizacoes: (stats?.finalizacoes || 0) + r.finalizacoes,
            gols_marcados: (stats?.gols_marcados || 0) + r.gols_marcados,
            assistencias: (stats?.assistencias || 0) + r.assistencias,
            cartoes_amarelos: (stats?.cartoes_amarelos || 0) + r.cartoes_amarelos,
            cartoes_vermelhos: (stats?.cartoes_vermelhos || 0) + r.cartoes_vermelhos,
            roubadas_bola: (stats?.roubadas_bola || 0) + r.roubadas_bola,
            aceleracao: (stats?.aceleracao || 0) + r.aceleracao,
            chute_forca: (stats?.chute_forca || 0) + r.chute_forca,
            passe_total: (stats?.passe_total || 0) + r.passe_total,
            drible: (stats?.drible || 0) + r.drible,
          };

          if (stats) {
            await stats.update(novos, { transaction: t });
          } else {
            await Estatisticas.create({ id_jogador: jogador.id_jogador, ...novos }, { transaction: t });
          }
        }
        console.log(`Rodada ${rodada}: ${records.length} jogadores importados.`);
        resolve();
      })
      .on('error', reject);
  });
}

exports.populate = async () => {
  const count = await Jogador.count();
  if (count > 0) {
    console.log('Dados já importados. Pulando populate.');
    return;
  }

  console.log('Iniciando importação LOCAL do Cartola...');
  const t = await sequelize.transaction();

  try {
    for (const r of RODADAS) {
      await processarRodadaLocal(r, t);
    }
    await t.commit();
    console.log('IMPORTAÇÃO CONCLUÍDA COM SUCESSO!');
  } catch (err) {
    await t.rollback();
    console.error('Erro fatal:', err);
    throw err;
  }
};
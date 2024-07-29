import { Pokemon } from '../models/index.js';

export async function getAllPkm(req, res) {
  const pkms = await Pokemon.findAll({
    include: 'types',
    order: [
      ['id', 'ASC'], // Trier par l'ID des Pokémon en ordre decroissant
      ['types', 'id', 'ASC'], // Trier par l'ID des Types en ordre decroissant
    ],
  });
  console.log('Pkms fetched');
  res.status(200).json(pkms);
}

export async function getPkmById(req, res) {
  const pkmId = req.params.id;
  const pkm = await Pokemon.findByPk(pkmId, {
    include: 'types',
    order: [
      ['id', 'ASC'], // Trier par l'ID des Pokémon en ordre decroissant
      ['types', 'id', 'ASC'], // Trier par l'ID des Types en ordre decroissant
    ],
  });
  console.log(`${pkm.name} fetched`);
  res.status(200).json(pkm);
}

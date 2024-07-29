import { Type } from '../models/index.js';

export async function getAllTypes(req, res) {
  const tags = await Type.findAll();

  console.log('Teams fetched');
  return res.status(200).json(tags);
}

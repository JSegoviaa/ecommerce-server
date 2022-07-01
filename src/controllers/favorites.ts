import { Request, Response } from 'express';

export const getFavoritesByUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    return res
      .status(201)
      .json({ ok: true, msg: 'Se ha obtenido tu lista de favoritos.' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de agregar eliminar favorito. Inténtlo más tarde.',
      error,
    });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    return res
      .status(201)
      .json({ ok: true, msg: 'El producto se ha agregado a tus favoritos.' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de agregar producto a favoritos. Inténtlo más tarde.',
      error,
    });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    return res
      .status(201)
      .json({ ok: true, msg: 'El producto se ha eliminado de tus favoritos.' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de agregar eliminar favorito. Inténtlo más tarde.',
      error,
    });
  }
};

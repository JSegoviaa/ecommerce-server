import { Request, Response } from 'express';

export const getAllComments = async (req: Request, res: Response) => {
  try {
    return res
      .status(201)
      .json({ ok: true, msg: 'Lista de todos los comentarios del producto.' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error al obtener todos los comentarios.',
      error,
    });
  }
};

export const getCommentsByProduct = async (req: Request, res: Response) => {
  try {
    return res.status(201).json({ ok: true, msg: 'Comentarios del producto.' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de obtener los comentarios del producto.',
      error,
    });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    return res
      .status(201)
      .json({ ok: true, msg: 'Su comentario ha sido añadido.' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de agregar un comentario.',
    });
  }
};

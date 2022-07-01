import { Request, Response } from 'express';

export const rateProduct = (req: Request, res: Response) => {
  try {
    return res
      .status(201)
      .json({ ok: true, msg: 'Se ha agregado su calificación.' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de calificar producto.',
      error,
    });
  }
};

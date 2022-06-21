import { Request, Response } from 'express';
import moment from 'moment';

//TODO
export const getHistoryByUser = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Historial de usuario', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de obtener historial de usuario',
      error,
    });
  }
};

export const createHistory = async (req: Request, res: Response) => {
  const { user_id, product_id } = req.body;
  const date = moment().format();
  try {
    return res
      .status(201)
      .json({ ok: true, msg: 'Se ha agregado a tu historial', date });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de crear historial',
      error,
    });
  }
};

export const deleteHistory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    return res
      .status(200)
      .json({ ok: true, msg: 'Se ha borrado de tu historial', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de eliminar historial',
      error,
    });
  }
};

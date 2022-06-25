import { Request, Response } from 'express';
import { db } from '../db';

export const uploadPicture = async (req: Request, res: Response) => {
  const url = req.file?.path;
  try {
    const text: string = 'INSERT INTO images(url) VALUES($1) RETURNING*';
    const values = [url];

    const { rows } = await db.query(text, values);

    const uploadedPicture = rows[0];

    return res.status(201).json({
      ok: true,
      msg: 'Se ha subido la imagen correctamente.',
      uploadedPicture,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al intentar subir imagen.',
      error,
    });
  }
};

export const uploadPictures = async (req: Request, res: Response) => {
  const pictures = req.files as Array<Express.Multer.File>;

  try {
    pictures?.forEach(async (file: Express.Multer.File) => {
      const text: string = 'INSERT INTO images(url) VALUES($1) RETURNING*';
      const values = [file.path];
      await db.query(text, values);
    });

    return res.status(201).json({
      ok: true,
      msg: 'Las imágenes se han subido correctamente.',
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de subir imágenes.',
      error,
    });
  }
};

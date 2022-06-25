import { Request, Response } from 'express';
import { db } from '../db';
import { UploadedPictures } from '../interfaces';

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
  let uploadedPictures: UploadedPictures[] = [];
  try {
    for (let i = 0; i < pictures.length; i++) {
      const text: string = 'INSERT INTO images(url) VALUES($1) RETURNING*';
      const values = [pictures[i].path];

      const { rows } = await db.query(text, values);

      uploadedPictures.push(rows[0]);
    }

    return res.status(201).json({
      ok: true,
      msg: 'Las imágenes se han subido correctamente.',
      uploadedPictures,
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

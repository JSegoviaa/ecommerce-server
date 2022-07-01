import { Request, Response } from 'express';
// import { v2 } from 'cloudinary';
import { db } from '../db';
import { UploadedPictures } from '../interfaces';

//TODO Revisar flujo de eliminación de imágenes cuando se tenga el front.
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

//TODO Revisar la eliminación de imágenes. La imagen se reemplaza no agrega a la db.
export const deletePictureFromCategory = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const textType = `SELECT image_id FROM categories WHERE id = $1`;
    const valuesType = [id];

    const { rows } = await db.query(textType, valuesType);

    const { image_id } = rows[0];

    const text: string = 'DELETE FROM images WHERE id = $1 RETURNING*';
    const values: string[] = [image_id];

    const deletedImg = await db.query(text, values);

    return res.status(200).json({
      ok: true,
      msg: 'La imagen se ha eliminado correctamente.',
      deletedImg: deletedImg.rows[0].url,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de eliminar la imagen.',
      error,
    });
  }
};

export const deletePictures = async (req: Request, res: Response) => {
  try {
    const text: string = 'DELETE FROM images WHERE id = $1 RETURNING*';
    const values = [1];

    const { rows } = await db.query(text, values);

    return res
      .status(200)
      .json({ ok: true, msg: 'Imágenes eliminadas correctamente', rows });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de eliminar las imágenes.',
    });
  }
};

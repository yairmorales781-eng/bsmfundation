// 1. Importar las herramientas que necesitamos
const express = require('express');
const multer = require('multer');
const path = require('path');

// 2. Configuración inicial
const app = express();
const PUERTO = 3000;

// 3. Configuración de Multer para guardar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // El primer argumento es para errores (null si no hay), el segundo es la carpeta de destino
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Creamos un nombre de archivo único para evitar sobreescribir
    // Será: fecha_actual_en_milisegundos-nombre_original_del_archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Inicializamos multer con la configuración de almacenamiento
const upload = multer({ storage: storage });

// 4. Servir archivos estáticos (nuestro frontend)
// Esto le dice a Express que la carpeta 'public' contiene archivos que se pueden acceder desde el navegador
app.use(express.static('public'));

// 5. Definir la ruta para la subida de archivos
// Esta es la ruta que especificamos en el 'action' de nuestro formulario HTML
// upload.single('miArchivo') es el middleware de multer. 'miArchivo' debe coincidir con el 'name' del input file en el HTML.
app.post('/subir-archivo', upload.single('miArchivo'), (req, res) => {
  
  // La información del formulario de texto está en req.body
  const datosDelFormulario = req.body;
  
  // La información del archivo subido está en req.file
  const infoDelArchivo = req.file;

  // Si no se subió ningún archivo, enviamos un error
  if (!infoDelArchivo) {
    return res.status(400).send('Error: Ningún archivo fue subido.');
  }

  console.log('Datos del formulario recibidos:', datosDelFormulario);
  console.log('Información del archivo guardado:', infoDelArchivo);

  // Enviamos una respuesta de éxito al usuario
  res.send(`
    <h1>¡Archivo recibido con éxito!</h1>
    <p><strong>Nombre original:</strong> ${infoDelArchivo.originalname}</p>
    <p><strong>Guardado como:</strong> ${infoDelArchivo.filename}</p>
    <p><strong>Localidad:</strong> ${datosDelFormulario.localidad}</p>
    <p><strong>Escuela:</strong> ${datosDelFormulario.escuela}</p>
    <a href="/">Volver al formulario</a>
  `);
});

// 6. Iniciar el servidor
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
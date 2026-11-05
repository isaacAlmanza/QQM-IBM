// API Serverless de Audiencia para Vercel (Node.js)
const fs = require('fs');
const path = require('path');

const TMP_FILE = '/tmp/audience_data.json';

// Estado en memoria del proceso
let memoryData = {
  active: false,
  question: '',
  options: [],
  votes: [0, 0, 0, 0],
  totalVotes: 0,
  token: ''
};

function readData() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed) {
        memoryData = parsed;
        return memoryData;
      }
    }
  } catch (e) {}
  return memoryData;
}

function saveData(data) {
  memoryData = data;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(data), 'utf8');
  } catch (e) {}
}

module.exports = function handler(req, res) {
  // Configuración de cabeceras CORS para acceso móvil
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action || '';
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {}
  }
  body = body || {};

  // 1. INICIAR VOTACIÓN
  if (action === 'start') {
    const question = body.question || '';
    const options = body.options || [];
    const token = 'poll_' + Date.now();

    const data = {
      active: true,
      question: question,
      options: options,
      votes: [0, 0, 0, 0],
      totalVotes: 0,
      token: token,
      startTime: Date.now()
    };

    saveData(data);
    return res.status(200).json({
      success: true,
      token: token,
      data: data
    });
  }

  // 2. ESTADO ACTUAL (Consultado por la pantalla del juego y los votantes móviles)
  if (action === 'status') {
    const data = readData();
    return res.status(200).json({
      success: true,
      data: data
    });
  }

  // 3. VOTAR (Desde el móvil de los asistentes)
  if (action === 'vote') {
    const data = readData();
    if (!data.active) {
      return res.status(200).json({
        success: false,
        message: 'No hay votación activa en este momento.'
      });
    }

    const optionIndex = parseInt(body.option, 10);
    if (isNaN(optionIndex) || optionIndex < 0 || optionIndex > 3) {
      return res.status(200).json({
        success: false,
        message: 'Opción inválida.'
      });
    }

    data.votes[optionIndex] = (data.votes[optionIndex] || 0) + 1;
    data.totalVotes = (data.totalVotes || 0) + 1;
    saveData(data);

    return res.status(200).json({
      success: true,
      message: '¡Voto registrado con éxito!',
      votes: data.votes,
      totalVotes: data.totalVotes
    });
  }

  // 4. CERRAR VOTACIÓN
  if (action === 'close') {
    const data = readData();
    data.active = false;
    saveData(data);
    return res.status(200).json({
      success: true,
      message: 'Votación cerrada.'
    });
  }

  // Por defecto retorna el estado
  const current = readData();
  return res.status(200).json({
    success: true,
    data: current
  });
};

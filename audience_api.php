<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$dataFile = __DIR__ . '/audience_data.json';

// Inicializar archivo si no existe
if (!file_exists($dataFile)) {
    $initialData = [
        'active' => false,
        'question' => '',
        'options' => [],
        'votes' => [0, 0, 0, 0],
        'totalVotes' => 0,
        'token' => ''
    ];
    file_put_contents($dataFile, json_encode($initialData, JSON_PRETTY_PRINT));
}

function getAudienceData($dataFile) {
    $content = @file_get_contents($dataFile);
    if (!$content) {
        return [
            'active' => false,
            'question' => '',
            'options' => [],
            'votes' => [0, 0, 0, 0],
            'totalVotes' => 0,
            'token' => ''
        ];
    }
    return json_decode($content, true);
}

function saveAudienceData($dataFile, $data) {
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// 1. INICIAR VOTACIÓN (Llamado por el juego cuando se pulsa el comodín)
if ($action === 'start') {
    $input = json_decode(file_get_contents('php://input'), true);
    $question = isset($input['question']) ? $input['question'] : '';
    $options = isset($input['options']) ? $input['options'] : [];
    $token = uniqid('poll_', true);

    $data = [
        'active' => true,
        'question' => $question,
        'options' => $options,
        'votes' => [0, 0, 0, 0],
        'totalVotes' => 0,
        'token' => $token,
        'startTime' => time()
    ];

    saveAudienceData($dataFile, $data);
    echo json_encode([
        'success' => true,
        'token' => $token,
        'data' => $data
    ]);
    exit;
}

// 2. OBTENER ESTADO ACTUAL (Consultado periódicamente por el juego y por los votantes móviles)
if ($action === 'status') {
    $data = getAudienceData($dataFile);
    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
    exit;
}

// 3. VOTAR (Llamado desde el celular de quien escanea el QR)
if ($action === 'vote') {
    $input = json_decode(file_get_contents('php://input'), true);
    $optionIndex = isset($input['option']) ? (int)$input['option'] : -1;
    $voterToken = isset($input['token']) ? $input['token'] : '';

    $data = getAudienceData($dataFile);

    if (!$data['active']) {
        echo json_encode(['success' => false, 'message' => 'No hay votación activa en este momento.']);
        exit;
    }

    if ($optionIndex < 0 || $optionIndex > 3) {
        echo json_encode(['success' => false, 'message' => 'Opción inválida.']);
        exit;
    }

    // Registrar voto
    $data['votes'][$optionIndex]++;
    $data['totalVotes']++;
    saveAudienceData($dataFile, $data);

    echo json_encode([
        'success' => true,
        'message' => '¡Voto registrado con éxito!',
        'votes' => $data['votes'],
        'totalVotes' => $data['totalVotes']
    ]);
    exit;
}

// 4. CERRAR VOTACIÓN (Cuando el jugador cierra el modal en el juego)
if ($action === 'close') {
    $data = getAudienceData($dataFile);
    $data['active'] = false;
    saveAudienceData($dataFile, $data);
    echo json_encode([
        'success' => true,
        'message' => 'Votación cerrada.'
    ]);
    exit;
}

// 5. OBTENER IP LOCAL (Para armar la URL del QR automáticamente)
if ($action === 'network_info') {
    $host = $_SERVER['HTTP_HOST'];
    echo json_encode([
        'success' => true,
        'host' => $host
    ]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Acción no reconocida.']);

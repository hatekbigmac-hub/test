<?php
/**
 * Dettex Messenger Backend API (V1)
 * This script handles chat message storage and retrieval.
 */

header('Content-Type: application/json');

$db_file = 'chat_database.json';

// Initialize empty database if not exists
if (!file_exists($db_file)) {
    file_put_contents($db_file, json_encode(['messages' => []]));
}

$action = $_GET['action'] ?? 'get_messages';

if ($action === 'get_messages') {
    $data = json_decode(file_get_contents($db_file), true);
    echo json_encode(['status' => 'success', 'data' => $data['messages']]);
} 
elseif ($action === 'send_message') {
    $sender = $_POST['sender'] ?? 'Unknown';
    $content = $_POST['content'] ?? '';
    $color = $_POST['color'] ?? '0xFFFFFFFF';
    
    if (empty($content)) {
        echo json_encode(['status' => 'error', 'message' => 'Empty content']);
        exit;
    }

    $data = json_decode(file_get_contents($db_file), true);
    
    $newMessage = [
        'sender' => $sender,
        'content' => $content,
        'color' => $color,
        'timestamp' => time()
    ];

    $data['messages'][] = $newMessage;
    
    // Keep only last 100 messages to save space
    if (count($data['messages']) > 100) {
        array_shift($data['messages']);
    }

    file_put_contents($db_file, json_encode($data));
    echo json_encode(['status' => 'success', 'message' => 'Sent']);
} 
else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>

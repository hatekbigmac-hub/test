<?php
/**
 * Dettex Messenger Professional Backend (V2)
 * Handles encrypted-ready message storage, user states, and friend lists.
 */

error_reporting(E_ALL);
ini_set('display_errors', 0); // Hide errors from direct output to avoid breaking JSON

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow client connections

$db_file = 'messenger_data.json';

// Ensure database exists with correct structure
if (!file_exists($db_file)) {
    $initial_data = [
        'messages' => [],
        'users' => [
            'Hatek' => ['status' => 'online', 'avatar' => 'avatar_hatek', 'activity' => 'Playing on FunTime'],
            'Saint' => ['status' => 'offline', 'avatar' => 'avatar_saint', 'activity' => 'Offline'],
            'defaultUser' => ['status' => 'offline', 'avatar' => 'avatar_general', 'activity' => 'Offline']
        ],
        'config' => ['max_messages' => 150]
    ];
    file_put_contents($db_file, json_encode($initial_data, JSON_PRETTY_PRINT));
}

$data = json_decode(file_get_contents($db_file), true);
$method = $_SERVER['REQUEST_METHOD'];
$action = $_REQUEST['action'] ?? 'get_all';

switch ($action) {
    case 'get_messages':
        // Return messages with a limit to avoid lag
        echo json_encode(['status' => 'success', 'data' => array_slice($data['messages'], -50)]);
        break;

    case 'send_message':
        if ($method === 'POST') {
            $sender = $_POST['sender'] ?? 'Unknown';
            $content = stripslashes(htmlspecialchars($_POST['content'] ?? ''));
            $is_geo = isset($_POST['is_geo']) && $_POST['is_geo'] === 'true';

            if (!empty($content)) {
                $newMessage = [
                    'id' => uniqid(),
                    'sender' => $sender,
                    'content' => $content,
                    'is_me' => false, // Client side determines this locally, or server based on session
                    'type' => $is_geo ? 'geo' : 'text',
                    'timestamp' => date('H:i'),
                    'unix_time' => time()
                ];

                $data['messages'][] = $newMessage;

                // Truncate logic
                if (count($data['messages']) > ($data['config']['max_messages'] ?? 100)) {
                    array_shift($data['messages']);
                }

                // Update user last seen
                if (isset($data['users'][$sender])) {
                    $data['users'][$sender]['status'] = 'online';
                }

                file_put_contents($db_file, json_encode($data, JSON_PRETTY_PRINT));
                echo json_encode(['status' => 'success', 'message_id' => $newMessage['id']]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Empty content']);
            }
        }
        break;

    case 'get_users':
        echo json_encode(['status' => 'success', 'users' => $data['users']]);
        break;

    case 'set_status':
        $user = $_POST['user'] ?? '';
        $status = $_POST['status'] ?? 'online';
        $activity = $_POST['activity'] ?? '';

        if (isset($data['users'][$user])) {
            $data['users'][$user]['status'] = $status;
            if (!empty($activity))
                $data['users'][$user]['activity'] = $activity;
            file_put_contents($db_file, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success']);
        }
        break;

    case 'clear_history':
        $data['messages'] = [];
        file_put_contents($db_file, json_encode($data, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success', 'message' => 'Chat cleared']);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}
?>

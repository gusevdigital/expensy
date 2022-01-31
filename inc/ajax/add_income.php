<?php

add_action('wp_ajax_add_income', 'expensy_ajax_add_income');

function expensy_ajax_add_income()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    // Check data
    $check = expensy_check_income_data($_POST);
    if (!$check['status']) {
        wp_die(json_encode($check));
    }

    // Add expense
    $entry_id = expensy_create_entry([
        'date' => $_POST['date'],
        'type' => $_POST['type'],
        'amount' => $_POST['amount'],
        'type' => 'inc',
        'cat' => $_POST['cat'],
        'note' => isset($_POST['note']) && $_POST['note'] ? $_POST['note'] : ''
    ]);

    if ($entry_id) wp_die(json_encode([
        'status' => 1,
        'message' => 'Income added!',
        'response' => intval($entry_id)
    ]));

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Failed to add income.'
    ]));
}

function expensy_check_income_data($data) {
    // Check require
    if (empty($data['date'])) $required[] = 'date';
    if (empty($data['amount'])) $required[] = 'amount';
    if (empty($data['cat'])) $required[] = 'cat';
    if ($required) return [
        'status' => 0,
        'message' => 'Please fill out all required fields.',
        'fields' => $required
    ];

    // Check amount equils zero
    if (!floatval($data['amount'])) return [
        'status' => 0,
        'message' => 'Amount must be greater than zero.',
        'fields' => ['amount']
    ];

    // Check if amount is too big
    if (floatval(preg_replace('/[^0-9.]+/', '', strval($data['amount']))) > 10000000000) return [
        'status' => 0,
        'message' => 'Amount must be less than 10.000.000.000. Like... Come on!',
        'fields' => ['amount']
    ];

    // Check if category exists
    global $wpdb;
    global $expensy_db_entry_cats;
    if (!$wpdb->get_var("SELECT COUNT(*) FROM $expensy_db_entry_cats WHERE id=" . $data['cat'])) return [
        'status' => 0,
        'message' => 'Caterogy error',
        'fields' => ['cat']
    ];

    return [
        'status' => 1
    ];
}
<?php

add_action('wp_ajax_update_settings', 'expensy_ajax_update_settings');

function expensy_ajax_update_settings()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    // Get user
    $user_id = get_current_user_id();

    // Check data
    $check = expensy_check_settings($_POST);
    if (!$check['status']) {
        wp_die(json_encode($check));
    }

    // User data
    $user_data = [
        'ID' => intval($user_id),
        'first_name' => esc_html($_POST['name'])
    ];

    if (isset($_POST['password']) && $_POST['password']) $user_data['user_pass'] = esc_attr($_POST['password']);

    // Update user
    $user_updated = wp_update_user($user_data);

    // Update currency
    $currency = $_POST['currency'] ? $_POST['currency'] : 'usd';
    $currency_updated = update_user_meta($user_id, 'expensy_currency', $currency);

    if (!is_wp_error($user_updated)) wp_die(json_encode([
        'status' => 1,
        'message' => 'Settings successfully updated!',
        'name' => $_POST['name'],
        'currency' => $currency
    ]));

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Failed to update settings.'
    ]));
}

function expensy_check_settings($data)
{
    // Check required fields
    $required = [];
    if ($data['name'] === '') $required[] = 'name';
    if ($data['currency'] === '') $required[] = 'currency';
    if ($required) return [
        'status' => 0,
        'message' => 'Please fill out all required fields.',
        'fields' => $required
    ];

    // Password length
    if ($data['password'] && 12 > strlen($data['password'])) return [
        'status' => 0,
        'message' => 'Password must be at least 12 characters.',
        'fields' => ['password']
    ];

    // Passwords match
    if ($data['password'] !== $data['confirm_password']) return [
        'status' => 0,
        'message' => 'Password confirmation does not match.',
        'fields' => ['confirm_password']
    ];

    return [
        'status' => 1
    ];
}

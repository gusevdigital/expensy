<?php

add_action('wp_ajax_setup', 'expensy_ajax_setup');

function expensy_ajax_setup()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    global $expensy_allowed_currencies;
    
    $user_id = get_current_user_id();

    if (!$user_id)  wp_die(json_encode([
        'status' => 0,
        'message' => 'User access error.'
    ]));

    $starting_budget = isset($_POST['starting_budget']) && $_POST['starting_budget'] ? floatval(str_replace(',', '', $_POST['starting_budget'])) : '0';
    $currency = isset($_POST['currency']) && $_POST['currency'] && in_array($_POST['currency'], $expensy_allowed_currencies) ? sanitize_text_field($_POST['currency']) : 'usd';

    $starting_budget_updated = update_user_meta($user_id, 'expensy_starting_budget', $starting_budget);
    $currency_updated = update_user_meta($user_id, 'expensy_currency', $currency);
    $setup = update_user_meta($user_id, 'expensy_setup', 1);

    if ($setup) wp_die(json_encode([
        'status' => 1,
        'message' => 'Awesome! Building data...'
    ]));

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Error setting up.'
    ]));
}
<?php

add_action('wp_ajax_init_state', 'expensy_ajax_init_state');
add_action('wp_ajax_nopriv_init_state', 'expensy_ajax_init_state');

function expensy_ajax_init_state()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    $response = expensy_get_init_data();

    if (!$response) wp_die(json_encode([
        'status' => 0,
        'message' => 'Failed to get init data'
    ]));
    else wp_die(json_encode([
        'status' => 1,
        'response' => $response,
        'message' => 'Successfully got init state'
    ]));


    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Error init state'
    ]));
}
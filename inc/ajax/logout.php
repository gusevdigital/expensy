<?php

add_action('wp_ajax_logout', 'expensy_ajax_logout');

function expensy_ajax_logout()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    if (is_user_logged_in()) {
        wp_logout();
        wp_die(json_encode([
            'status' => 1,
            'Logout successful, redirecting...'
        ]));
    }

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Something went wrong.'
    ]));
}
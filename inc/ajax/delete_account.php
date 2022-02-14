<?php

add_action('wp_ajax_delete_account', 'expensy_ajax_delete_account');

function expensy_ajax_delete_account()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    $user_id = get_current_user_id();

    if (current_user_can('manage_options')) wp_die(json_encode([
        'status' => 0,
        'message' => 'Administrators cannot delete their own accounts.'
    ]));

    // Delete everything in db
    $user_data_deleted = expensy_delete_user_data();

    // Delete user meta
    $meta = get_user_meta($user_id);
    foreach ($meta as $key => $val) {
        delete_user_meta($user_id, $key);
    }

    // Destroy user's session
    wp_logout();

    // Delete the user's account
    $deleted = wp_delete_user($user_id);

    if ($deleted) {
        wp_die(json_encode([
            'status' => 1,
            'message' => 'User successfully deleted.'
        ]));
    }

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Failed to add income.'
    ]));
}

<?php

add_action('wp_ajax_delete_entry', 'expensy_ajax_delete_entry');

function expensy_ajax_delete_entry()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    // Check data
    $id = intval($_POST['id']);
    if (!$id) wp_die(json_encode([
        'status' => 0,
        'message' => 'Provided invalid data.'
    ]));

    $is_deleted = expensy_delete_entry($id);

    if ($is_deleted) wp_die(json_encode([
        'status' => 1,
        'message' => 'Entry successfully deleted.',
    ]));

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Failed to delete entry'
    ]));
}

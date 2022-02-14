<?php

add_action('wp_ajax_edit_cat', 'expensy_ajax_edit_cat');

function expensy_ajax_edit_cat()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    $id = intval($_POST['id']);
    $name = trim($_POST['name']);

    // Check data
    if (!$id || !$name) wp_die(json_encode([
        'status' => 0,
        'message' => "Failed to update"
    ]));

    // Update cat
    $updated = expensy_update_cat($id, [
        'name' => $name
    ]);

    if ($updated) wp_die(json_encode([
        'status' => 1,
        'message' => 'Successfully update!',
    ]));

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => "Failed to update. ☹"
    ]));
}

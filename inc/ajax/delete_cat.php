<?php

add_action('wp_ajax_delete_cat', 'expensy_ajax_delete_cat');

function expensy_ajax_delete_cat()
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

    $is_deleted = expensy_delete_cat($id);

    if ($is_deleted) wp_die(json_encode([
        'status' => 1,
        'message' => 'Category successfully deleted.',
        'state' => expensy_get_init_data()
    ]));

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Failed to delete category.'
    ]));
}

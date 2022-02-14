<?php

add_action('wp_ajax_order_cats', 'expensy_ajax_order_cats');

function expensy_ajax_order_cats()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    // Prepare data
    $cats = explode(',', $_POST['cats']);

    // Check data
    if (!$cats) wp_die(json_encode([
        'status' => 0,
        'message' => "Failed to order" . print_r($cats, 1)
    ]));

    // Update cat
    $updated = expensy_order_cats($cats);

    if ($updated) wp_die(json_encode([
        'status' => 1,
        'message' => 'Successfully update!',
        'cats' => expensy_get_cats()
    ]));

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => "Failed to order."
    ]));
}

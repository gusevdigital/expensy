<?php

add_action('wp_ajax_add_cat', 'expensy_ajax_add_cat');

function expensy_ajax_add_cat()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    // Check data
    $check = expensy_check_cat_data($_POST);
    if (!$check['status']) {
        wp_die(json_encode($check));
    }

    // Add cat
    $cat_id = expensy_create_cat([
        'type' => $_POST['type'],
        'name' => $_POST['name'],
        'color' => $_POST['color']
    ]);

    if ($cat_id) wp_die(json_encode([
        'status' => 1,
        'message' => 'New category added!',
        'id' => intval($cat_id)
    ]));

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Failed to add category.'
    ]));
}

function expensy_check_cat_data($data)
{
    // Check require
    $required = [];
    if (empty($data['color'])) $required[] = 'color';
    if (empty($data['name'])) $required[] = 'name';
    if ($required) return [
        'status' => 0,
        'message' => 'Please fill out all required fields.',
        'fields' => $required
    ];

    return [
        'status' => 1
    ];
}

<?php

add_action('wp_ajax_switch_month', 'expensy_ajax_switch_month');
add_action('wp_ajax_nopriv_switch_month', 'expensy_ajax_switch_month');

function expensy_ajax_switch_month()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    // Check data
    if (!(isset($_POST['month']) && $_POST['month'] && isset($_POST['year']) && $_POST['year'])) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Wrong data provided.'
        ]));
    }

    $entries = expensy_get_entries($_POST['month'], $_POST['year']);
    $starting_budget = expensy_get_starting_budget($_POST['month'], $_POST['year']);

    wp_die(json_encode([
        'status' => 1,
        'entries' => $entries,
        'starting_budget' => $starting_budget,
        'message' => 'Loading new month data!'
    ]));


    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Error receive month data.'
    ]));
}
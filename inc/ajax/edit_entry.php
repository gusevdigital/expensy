<?php

add_action('wp_ajax_edit_entry', 'expensy_ajax_edit_entry');

function expensy_ajax_edit_entry()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    // Check data
    // See add_entry.php file
    //! Need to place all those ajax helpers separately
    $check = expensy_check_entry_data($_POST);
    if (!$check['status']) {
        wp_die(json_encode($check));
    }

    // Update entry
    $updated = expensy_update_entry($_POST['id'], [
        'date' => $_POST['date'],
        'amount' => $_POST['amount'],
        'cat' => $_POST['cat'],
        'note' => isset($_POST['note']) && $_POST['note'] ? $_POST['note'] : ''
    ]);

    if ($updated) wp_die(json_encode([
        'status' => 1,
        'message' => 'Successfully update!',
        'response' => $updated
    ]));

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => "Failed to update. ☹"
    ]));
}

<?php

require_once(get_theme_file_path('/inc/ajax/init_state.php'));
require_once(get_theme_file_path('/inc/ajax/login.php'));
require_once(get_theme_file_path('/inc/ajax/logout.php'));
require_once(get_theme_file_path('/inc/ajax/reset.php'));
require_once(get_theme_file_path('/inc/ajax/register.php'));
require_once(get_theme_file_path('/inc/ajax/setup.php'));
require_once(get_theme_file_path('/inc/ajax/add_entry.php'));
require_once(get_theme_file_path('/inc/ajax/delete_entry.php'));
require_once(get_theme_file_path('/inc/ajax/edit_entry.php'));
require_once(get_theme_file_path('/inc/ajax/switch_month.php'));


add_action('wp_ajax_nopriv_return_world', 'getCrud');
add_action('wp_ajax_return_world', 'getCrud');

function getCrud()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error',
        ]));
    }

    /*
    * CREATE ENTRY
    */
    // $entry_id = expensy_create_entry([
    //     'date' => '2021-12-28',
    //     'type' => 'inc',
    //     'amount' => 3000.00,
    //     'cat' => 33,
    //     'note' => 'Salary'
    // ]);

    // if (!$entry_id) wp_die(json_encode([
    //     'status' => 0,
    //     'message' => 'Failed to create entry',
    // ]));

    // wp_die(json_encode([
    //     'status' => 1,
    //     'id' => intval($entry_id)
    // ]));

    /*
    * GET ENTRIES
    */
    // $entries = expensy_get_entries(12, 2021);

    // if (!$entries) wp_die(json_encode([
    //     'status' => 0,
    //     'message' => 'Failed to get entries'
    // ]));
    // else wp_die(json_encode([
    //     'status' => 1,
    //     'data' => $entries
    // ]));

    /*
    * UPDATE ENTRY
    */
    // $response = expensy_update_entry(9, [
    //     'note' => 'Grocery'
    // ]);

    // if ($response === false) wp_die(json_encode([
    //     'status' => 0,
    //     'message' => 'Failed to update entry'
    // ]));
    // else wp_die(json_encode([
    //     'status' => 1
    // ]));


    /*
    * DELETE ENTRY
    */
    // $response = expensy_delete_entry(45);

    // if (!$response) wp_die(json_encode([
    //     'status' => 0,
    //     'message' => 'Failed to delete entry'
    // ]));
    // else wp_die(json_encode([
    //     'status' => 1
    // ]));

    /*
    * CREATE CATEGORY
    */
    // $cat_id = expensy_create_cat([
    //     'type' => 'exp',
    //     'name' => 'Investment',
    //     'color' => 'shark'
    // ]);

    // if (!$cat_id) wp_die(json_encode([
    //     'status' => 0,
    //     'message' => 'Failed to create category',
    // ]));
    // else wp_die(json_encode([
    //     'status' => 1,
    //     'id' => intval($cat_id)
    // ]));



    /*
    * GET CATEGORIES
    */
    // $cats = expensy_get_cats();

    // if (!$cats) wp_die(json_encode([
    //     'status' => 0,
    //     'message' => 'Failed to get categories'
    // ]));
    // else wp_die(json_encode([
    //     'status' => 1,
    //     'data' => $cats
    // ]));

    /*
    * UPDATE CATEGORY
    */
    // $response = expensy_update_cat(34, [
    //     'name' => 'Inverst',
    //     'color' => 'shark'
    // ]);

    // if ($response === false) wp_die(json_encode([
    //     'status' => 0,
    //     'message' => 'Failed to update category'
    // ]));
    // else wp_die(json_encode([
    //     'status' => 1
    // ]));

    /*
    * DELETE CATEGORY
    */
    // $response = expensy_delete_cat(34);

    // if (!$response) wp_die(json_encode([
    //     'status' => 0,
    //     'message' => 'Failed to delete category'
    // ]));
    // else wp_die(json_encode([
    //     'status' => 1
    // ]));

    /*
    * GET INIT DATA
    */
    // $response = expensy_get_init_data();

    // if (!$response) wp_die(json_encode([
    //     'status' => 0,
    //     'message' => 'Failed to get init data'
    // ]));
    // else wp_die(json_encode([
    //     'status' => 1,
    //     'response' => $response,
    //     'message' => 'success'
    // ]));

    // // KBAI!
    wp_die(json_encode([
        'status' => 1
    ]));

    /*
    * GET STARTING BUDGET FOR A SPECIFIC MONTH
    */
    // $response = expensy_get_starting_budget(12, 2021);
    // wp_die(json_encode([
    //     'status' => 1,
    //     'response' => $response,
    //     'message' => 'success'
    // ]));
}

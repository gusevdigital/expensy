<?php

/**
 * Get all init data for a user
 *
 * @return associative_array 
 */

function expensy_get_init_data()
{
    if (!is_user_logged_in()) return ['logged' => false];

    // User data
    $user_id = get_current_user_id();
    $user = get_userdata($user_id);
    $name = $user->first_name;
    $email = $user->user_email;
    $setup = get_user_meta($user_id, 'expensy_setup', true);
    $currency = get_user_meta($user_id, 'expensy_currency', true);

    // Current date
    $month = date('m');
    $year = date('Y');

    // Starting budget
    $starting_budget = expensy_get_starting_budget($month, $year);

    // Entries
    $entries = expensy_get_entries();

    // Cats
    $cats = expensy_get_cats();

    $data = [
        'logged' => true,
        'setup' => $setup,
        'account' => [
            'id' => $user_id,
            'name' => $name,
            'email' => $email,
            'currency' => $currency
        ],
        'current_date' => [
            'year' => $year,
            'month' => $month
        ],
        'starting_budget' => $starting_budget,
        'entries' => $entries,
        'cats' => $cats
    ];

    return $data;
}

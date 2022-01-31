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
    $setup_starting_budget = get_user_meta($user_id, 'expensy_starting_budget', true);

    // Current date
    $month = date('m');
    $year = date('Y');

    // Starting budget
    $starting_budget = expensy_get_starting_budget($month, $year);
    $starting_budget = floatval($starting_budget) + floatval($setup_starting_budget);

    // Entries
    $entries = expensy_get_entries();

    // Cats
    $cats = expensy_get_cats();

    // Is there next month data
    $next_month = expensy_get_entries_count('next') ? true : false;

    // Is there prev month data
    $prev_month = expensy_get_entries_count('prev') ? true : false;

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
        'cats' => $cats,
        'next_month' => $next_month,
        'prev_month' => $prev_month
    ];

    return $data;
}

<?php

/*
* CONSTANTS & GLOBALS
*/

$expensy_db_entries = $wpdb->prefix . 'expensy_entries';
$expensy_db_entry_cats = $wpdb->prefix . 'expensy_entry_cats';
$expensy_allowed_currencies = ['usd', 'ruble', 'euro'];

/*
* DEPENDENCIES
*/
require_once(get_theme_file_path('/inc/helpers.php'));
require_once(get_theme_file_path('/inc/cleanup.php'));
require_once(get_theme_file_path('/inc/enqueue.php'));
require_once(get_theme_file_path('/inc/db.php'));
require_once(get_theme_file_path('/inc/crud.php'));
require_once(get_theme_file_path('/inc/ajax.php'));
require_once(get_theme_file_path('/inc/init.php'));


// ------------------------------
// RESTRICTIONS
// ------------------------------

// Redirect from login page to the main app
add_action('init','expensy_login_page');
function expensy_login_page(){
    global $pagenow;
    if ('wp-login.php' == $pagenow && (!isset($_GET['action'])) || (isset($_GET['action']) && !$_GET['action'] === 'rp')) {
        wp_redirect(site_url('/'));
        exit();
    }
}

// Redirect everyone expect admin from wp-admin
function my_login_redirect($url, $request, $user) {
	if ($user && is_object($user) && is_a($user, 'WP_User')) {
		$url = $user->has_cap('administrator') ? admin_url() : site_url('/');
	}
	return $url;
}

add_filter('login_redirect', 'my_login_redirect', 10, 3 );

// Show admin bar only for admins
if (!current_user_can('manage_options')) {
    add_filter('show_admin_bar', '__return_false');
}

// ------------------------------
// GET ENTRY DATA
// ------------------------------


function expensy_db_features()
{
    global $wpdb;
    global $expensy_db_entries;

    // var_dump($wpdb->get_var("SELECT user_id FROM $expensy_db_entries WHERE id=45"));

    $user_id = get_current_user_id();
    $user = get_userdata($user_id);

    // var_dump($user);

    $currency = get_user_meta($user_id, 'expensy_currency', true);
    $month = 1;
    $year = 2022;

    // Get all user data for January 2022
    $data = $wpdb->get_results("
        SELECT 
            id,
            entry_date AS date,
            entry_type AS type,
            entry_amount AS amount,
            entry_cat AS cat,
            entry_note AS note
        FROM
            $expensy_db_entries
        WHERE
            user_id=$user_id AND MONTH(entry_date)=$month AND YEAR(entry_date) = $year
        ORDER BY
            created_at DESC;
    ");
}

add_action('wp', 'expensy_db_features');

// ------------------------------
// UPDATE USER META
// ------------------------------


// update_user_meta($user_id, 'expensy_currency', 'us_US');

// ------------------------------
// INSERT ENTRY DATA
// ------------------------------

// $inserted = $wpdb->insert($expensy_db_entries, [
//     'user' => get_current_user_id(),
//     'entry_date' => date('Y-m-d', strtotime('2012-08-14')),
//     'entry_type' => substr('exp', 0, 3),
//     'entry_amount' => 12345.67,
//     'entry_cat' => 4,
//     'entry_note' => 'Booked flight and tickets to Singapore'
// ]);

// if (!$inserted) wp_die(json_encode([
//     'status' => 0,
//     'message' => 'Insert error'
// ])); 

// ------------------------------
// INSERT CATEGORY DATA
// ------------------------------

// $inserted = $wpdb->insert($expensy_db_entry_cats, [
//     'user' => get_current_user_id(),
//     'cat_type' => substr('exp', 0, 3),
//     'cat_name' => 'Travel',
//     'cat_color' => 'sunglow'
// ]);

// if (!$inserted) wp_die(json_encode([
//     'status' => 0,
//     'message' => 'Insert error'
// ]));

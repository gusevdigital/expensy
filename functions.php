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
add_action('init', 'expensy_login_page');
function expensy_login_page()
{
    global $pagenow;
    if ('wp-login.php' == $pagenow && (!isset($_GET['action'])) || (isset($_GET['action']) && !$_GET['action'] === 'rp')) {
        wp_redirect(site_url('/'));
        exit();
    }
}

// Redirect everyone expect admin from wp-admin
function my_login_redirect($url, $request, $user)
{
    if ($user && is_object($user) && is_a($user, 'WP_User')) {
        $url = $user->has_cap('administrator') ? admin_url() : site_url('/');
    }
    return $url;
}

add_filter('login_redirect', 'my_login_redirect', 10, 3);

// Show admin bar only for admins
if (!current_user_can('manage_options')) {
    add_filter('show_admin_bar', '__return_false');
}

<?php

/*
* ENQUEUE STYLES & SCRIPTS
*/

function expensy_enqueue_scripts()
{
    wp_enqueue_style('theme-css', get_theme_file_uri('/dist/app.css'), array(), filemtime(get_theme_file_path('/dist/app.css')));

    wp_enqueue_script('theme-js', get_theme_file_uri('/dist/app.js'), array(), filemtime(get_theme_file_path('/dist/app.js')), false);
    wp_localize_script('theme-js', 'themeData', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'ajax_nonce' => wp_create_nonce('ajax-nonce')
    ));
}

add_action('wp_enqueue_scripts', 'expensy_enqueue_scripts');

/*
* DEFER SCRIPTS IN THE HEADER
*/

function expensy_defer_parsing_js($url)
{
    if (is_admin()) return $url; //don't break WP Admin
    if (FALSE === strpos($url, '.js')) return $url;
    return str_replace(' src', ' defer src', $url);
}

add_filter('script_loader_tag', 'expensy_defer_parsing_js', 10);

<?php

// Disable XML-RPC RSD
remove_action('wp_head', 'rsd_link');

// Remove WordPress version number
function remove_version()
{
    return '';
}
add_filter('the_generator', 'remove_version');

// Remove wlwmanifest link
remove_action('wp_head', 'wlwmanifest_link');

// Remove shortlink
remove_action('wp_head', 'wp_shortlink_wp_head');

// Disable Link header for the REST API
remove_action('wp_head', 'rest_output_link_wp_head', 10);
remove_action('template_redirect', 'rest_output_link_header', 11, 0);

// Remove oEmbed discovery links
remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);

// Remove S.W.org DNS prefetch
add_action('init', 'expensy_remove_dns_prefetch');
function  expensy_remove_dns_prefetch()
{
    remove_action('wp_head', 'wp_resource_hints', 2, 99);
}

// Disable emoji
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

// Remove Gutenberg Block Library CSS
function expensy_remove_wp_block_library_css()
{
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-block-style');
}
add_action('wp_enqueue_scripts', 'expensy_remove_wp_block_library_css', 100);

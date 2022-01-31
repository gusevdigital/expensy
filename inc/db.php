<?php

function expensy_setup_db()
{
    global $wpdb;
    global $expensy_db_entries;
    global $expensy_db_entry_cats;
    $charset_collate = $wpdb->get_charset_collate();
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

    // Entries
    $entries_sql = "CREATE TABLE $expensy_db_entries (
        id INTEGER NOT NULL AUTO_INCREMENT,
        user INTEGER NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        entry_date DATETIME NOT NULL,
        entry_type VARCHAR(3) NOT NULL,
        entry_amount DECIMAL(18,2) NOT NULL,
        entry_cat INTEGER NOT NULL,
        entry_note VARCHAR(200),
        UNIQUE KEY id (id)
    ) $charset_collate;";

    $entries_sql_response  = maybe_create_table($expensy_db_entries, $entries_sql);

    // Entry categories
    $entries_sql = "CREATE TABLE $expensy_db_entry_cats (
        cat_id INTEGER NOT NULL AUTO_INCREMENT,
        user INTEGER NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        cat_type VARCHAR(3) NOT NULL,
        cat_name VARCHAR(20),
        cat_color varchar(20),
        UNIQUE KEY cat_id (cat_id)
    ) $charset_collate;";

    $entry_cat_sql_response  = maybe_create_table($expensy_db_entry_cats, $entries_sql);
}

add_action('wp', 'expensy_setup_db');

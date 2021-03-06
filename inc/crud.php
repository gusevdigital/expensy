<?php

/**
 * Create entry
 *
 * @param associative_array $data [date (Date), type (String), amount (Float), cat (Int), note (String)(Optional)]
 *
 * @return Integer|Boolean ID of a new entry, or false if failed to create
 */

function expensy_create_entry($data)
{
    // Check user
    if (!is_user_logged_in()) return false;

    // Data check
    if (
        (!isset($data['date']) || !$data['date']) &&
        (!isset($data['type']) || !$data['type']) &&
        (!isset($data['amount']) || !$data['amount']) &&
        (!isset($data['cat']) || !$data['cat'])
    ) return false;

    global $wpdb;
    global $expensy_db_entries;
    $user_id = get_current_user_id();

    $request = [
        'user_id' => intval($user_id),
        'entry_date' => date('Y-m-d', strtotime($data['date'])),
        'entry_type' => substr(esc_html($data['type']), 0, 3),
        'entry_amount' => floatval(preg_replace('/[^0-9.]+/', '', strval($data['amount']))),
        'entry_cat' => intval($data['cat']),
        'entry_note' => isset($data['note']) && $data['note'] ? substr(trim(esc_sql($data['note'])), 0, 200) : ''
    ];

    $response = $wpdb->insert($expensy_db_entries, $request);

    if (is_wp_error($response) || !$response || !$wpdb->insert_id) return false;

    return $wpdb->insert_id;
}

/**
 * Get all entries for a specific user, a month and a year
 *
 * @param integer $month (Optional) Month number from 1 to 12. Default: current month.
 * @param integer $year (Optional) Year. Default: current year.
 *
 * @return associative_array List of entries grouped by day.
 */

function expensy_get_entries($month = null, $year = null)
{
    // Check user
    if (!is_user_logged_in()) return false;

    // Set month and year
    if (!$month) $month = date('m');
    if (!$year) $year = date('Y');

    global $wpdb;
    global $expensy_db_entries;
    $user_id = get_current_user_id();

    $response = $wpdb->get_results("
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
            user_id=$user_id AND MONTH(entry_date)=$month AND YEAR(entry_date)=$year
        ORDER BY
            created_at DESC;
    ");

    if (is_wp_error($response) || !$response || !is_array($response)) return false;

    // Prepare entries
    $entries = [];

    foreach ($response as $entry) {
        $date_str = $entry->date;
        $date = strtotime($date_str);
        $day = date('d', $date);
        $month = date('m', $date);
        $year = date('Y', $date);
        $entries["$year-$month-$day"][] = $entry;
    }

    return $entries;
}

/**
 * Update entry
 *
 * @param integer $id Entry ID
 * @param associative_array $data [date (Date) | type (String) | amount (Float) | cat (Int) | note (String)]
 *
 * @return boolean true in case of success; false in case of fail.
 */

function expensy_update_entry($id, $data)
{
    // Check user
    if (!is_user_logged_in()) return false;

    $id = intval($id);

    // Data check
    if (!$id) return false;

    global $wpdb;
    global $expensy_db_entries;

    // Permission check
    $entry_user_id = $wpdb->get_var("SELECT user_id FROM $expensy_db_entries WHERE id=$id");
    if (get_current_user_id() !== intval($entry_user_id)) return false;

    $request = [
        'entry_date' => date('Y-m-d', strtotime($data['date'])),
        'entry_amount' => floatval(preg_replace('/[^0-9.]+/', '', strval($data['amount']))),
        'entry_cat' => intval($data['cat']),
        'entry_note' => isset($data['note']) && $data['note'] ? substr(trim(esc_sql($data['note'])), 0, 200) : ''
    ];

    $response = $wpdb->update($expensy_db_entries, $request, ['id' => $id]);

    if (is_wp_error($response) || $response === false) return false;

    return true;
}

/**
 * Delete entry
 *
 * @param integer $id Entry ID
 *
 * @return boolean true in case of success; false in case of fail.
 */

function expensy_delete_entry($id)
{
    // Check user
    if (!is_user_logged_in()) return false;

    $id = intval($id);

    // Data check
    if (!$id) return false;

    global $wpdb;
    global $expensy_db_entries;

    // Permission check
    $entry_user_id = $wpdb->get_var("SELECT user_id FROM $expensy_db_entries WHERE id=$id");
    if (get_current_user_id() !== intval($entry_user_id)) return false;

    $request = ['id' => intval($id)];

    $response = $wpdb->delete($expensy_db_entries, $request);

    if (is_wp_error($response) || !$response) return false;

    return true;
}

/**
 * Create category
 *
 * @param associative_array $data [type (String), name (String), color (String)]
 *
 * @return Integer|Boolean ID of a new category, or false if failed to create
 */

function expensy_create_cat($data)
{
    // Check user
    if (!is_user_logged_in()) return false;

    // Data check
    if (
        (!isset($data['type']) || !$data['type']) &&
        (!isset($data['name']) || !$data['name']) &&
        (!isset($data['color']) || !$data['color'])
    ) return false;

    global $wpdb;
    global $expensy_db_entry_cats;
    $user_id = get_current_user_id();
    $type = $data['type'];

    $cats_count = $wpdb->get_results("
        SELECT 
            MAX(cat_order) as max
        FROM
            $expensy_db_entry_cats
        WHERE
            user_id=$user_id AND cat_type='$type';
    ");

    $order = intval($cats_count[0]->max) + 1;

    $request = [
        'user_id' => intval($user_id),
        'cat_type' => substr(esc_html($data['type']), 0, 3),
        'cat_name' => substr(esc_sql($data['name']), 0, 18),
        'cat_color' => substr(esc_sql($data['color']), 0, 20),
        'cat_order' => $order,
        'cat_fixed' => $data['fixed'] ? 1 : 0
    ];

    $response = $wpdb->insert($expensy_db_entry_cats, $request);

    if (is_wp_error($response) || !$response || !$wpdb->insert_id) return false;

    return $wpdb->insert_id;
}

/**
 * Get categories
 *
 * @return array User categories
 */

function expensy_get_cats()
{
    // Check user
    if (!is_user_logged_in()) return false;

    global $wpdb;
    global $expensy_db_entry_cats;
    $user_id = get_current_user_id();

    $response = $wpdb->get_results("
        SELECT 
            cat_id AS id,
            cat_name AS name,
            cat_type AS type,
            cat_color AS color,
            cat_order AS order_index,
            cat_fixed AS fixed
        FROM
            $expensy_db_entry_cats
        WHERE
            user_id=$user_id
        ORDER BY
            cat_order ASC;
    ");

    if (is_wp_error($response) || !$response || !is_array($response)) return false;

    return $response;
}

/**
 * Update category
 *
 * @param integer $id Category ID
 * @param associative_array $data [type (String), name (String), color (String)]
 *
 * @return boolean true in case of success; false in case of fail.
 */

function expensy_update_cat($id, $data)
{
    // Check user
    if (!is_user_logged_in()) return false;

    // Data check
    $id = intval($id);
    if (!$id) return false;

    global $wpdb;
    global $expensy_db_entry_cats;


    // Permission check
    $cat_user_id = $wpdb->get_var("SELECT user_id FROM $expensy_db_entry_cats WHERE cat_id=$id");
    if (get_current_user_id() !== intval($cat_user_id)) return false;

    // Prepare data
    $data = sql_process_cat_keys($data);

    // Update SQL
    $response = $wpdb->update($expensy_db_entry_cats, $data, ['cat_id' => $id]);

    if (is_wp_error($response) || $response === false) return false;

    return true;
}

/**
 * Delete category
 *
 * @param integer $id Catergory ID
 *
 * @return boolean true in case of success; false in case of fail.
 */

function expensy_delete_cat($id)
{
    // Check user
    if (!is_user_logged_in()) return false;

    // Data check
    $id = intval($id);
    if (!$id) return false;

    global $wpdb;
    global $expensy_db_entry_cats;
    global $expensy_db_entries;

    // User id
    $user_id = get_current_user_id();


    // Permission check
    $cat_user_id = $wpdb->get_var("SELECT user_id FROM $expensy_db_entry_cats WHERE cat_id=$id");
    if ($user_id !== intval($cat_user_id)) return false;

    // Get cat
    $cat = $wpdb->get_results("
        SELECT 
            cat_type AS type,
            cat_fixed AS fixed
        FROM
            $expensy_db_entry_cats
        WHERE
            cat_id=$id
        ORDER BY
            cat_id ASC;
    ");

    if ($cat[0]->fixed) return false;

    $type = $cat[0]->type;

    // Delete the cat
    $request = ['cat_id' => $id];

    $response = $wpdb->delete($expensy_db_entry_cats, $request);

    // Get the first fixed cat
    $fixed_cat = $wpdb->get_var("SELECT cat_id FROM $expensy_db_entry_cats WHERE user_id=$user_id AND cat_fixed=1 AND cat_type='$type'");

    // Update all entries for the deleted cat
    $updated_entries = $wpdb->update($expensy_db_entries, ['entry_cat' => $fixed_cat], ['entry_cat' => $id]);

    if (is_wp_error($response) || !$response) return false;

    return true;
}

/**
 * Change categories order
 *
 * @param integer $id Category ID
 * @param array $cats
 *
 * @return interger Number or rows affected or false on error
 */

function expensy_order_cats($cats)
{
    // Check user
    if (!is_user_logged_in()) return false;

    // Data check
    if (!isset($cats) || !is_array($cats) || !$cats) return false;

    global $wpdb;
    global $expensy_db_entry_cats;
    $user_id = get_current_user_id();

    // Prepare data
    $cat_list = implode(', ', $cats);

    $request = "UPDATE $expensy_db_entry_cats\nSET cat_order=(case ";
    foreach ($cats as $i => $id) {
        $id = intval($id);
        $order = $i + 1;
        $request .= "when cat_id=$id then $order\n";
    }
    $request .= "else null\nend)\n";
    $request .= "WHERE user_id=$user_id AND cat_id IN ($cat_list);";

    // Update SQL
    $response = $wpdb->query($wpdb->prepare($request));

    if (is_wp_error($response) || $response === false) return false;

    return true;
}


/**
 * Get entries count for a specific month and a year
 *
 * @param integer $month (Optional) Month number from 1 to 12. Default: current month. Could be just text 'next' or 'prev' to get next or previous month data
 * @param integer $year (Optional) Year. Default: current year.
 *
 * @return integer Amount of found entries
 */

function expensy_get_entries_count($month = null, $year = null)
{
    // Check user
    if (!is_user_logged_in()) return false;

    // Set month and year
    if (!$year && ($month === 'next' || $month === 'prev')) {
        if ($month === 'next') {
            $next_month_date = strtotime('first day of +1 month');
            $month = date('m', $next_month_date);
            $year = date('Y', $next_month_date);
        }
        if ($month === 'prev') {
            $prev_month_date = strtotime('first day of -1 month');
            $month = date('m', $prev_month_date);
            $year = date('Y', $prev_month_date);
        }
    } else {
        $month = intval($month);
        $year = intval($year);
        if (!$month) $month = date('m');
        if (!$year) $year = date('Y');
    }

    global $wpdb;
    global $expensy_db_entries;
    $user_id = get_current_user_id();

    $response = $wpdb->get_results("
        SELECT 
            COUNT(*) as count
        FROM
            $expensy_db_entries
        WHERE
            user_id=$user_id AND MONTH(entry_date)=$month AND YEAR(entry_date)=$year;
    ");

    if (is_wp_error($response) || $response === false || !is_array($response)) return false;

    return $response[0]->count;
}

/**
 * Get starting budget for a specific month and a year
 *
 * @param integer $month (Optional) Month number from 1 to 12. Default: current month. Could be just text 'next' or 'prev' to get next or previous month data
 * @param integer $year (Optional) Year. Default: current year.
 *
 * @return float Starting budget sum
 */

function expensy_get_starting_budget($month = null, $year = null)
{
    // Check user
    if (!is_user_logged_in()) return false;

    // Set month and year 
    $month = intval($month);
    $year = intval($year);
    if (!$month) $month = date('m');
    if (!$year) $year = date('Y');
    $starting_day = date('Ym01', strtotime("$year-$month-01"));

    global $wpdb;
    global $expensy_db_entries;
    $user_id = get_current_user_id();

    $entries = $wpdb->get_results("
        SELECT 
            entry_type as type,
            entry_amount as amount
        FROM
            $expensy_db_entries
        WHERE
            user_id=$user_id AND entry_date<$starting_day;
    ");

    // Process entries
    $sum = 0;
    foreach ($entries as $entry) {
        if ($entry->type === 'inc') $sum += floatval($entry->amount);
        if ($entry->type === 'exp') $sum -= floatval($entry->amount);
    }

    // Get user custom starting budget
    $setup_starting_budget = get_user_meta($user_id, 'expensy_starting_budget', true);

    $sum = floatval($sum) + floatval($setup_starting_budget);

    return $sum;
}

/**
 * Delete user data
 *
 * @return boolean True on success, false on fail.
 */

function expensy_delete_user_data()
{
    // Check user
    if (!is_user_logged_in()) return false;

    $user_id = get_current_user_id();

    global $wpdb;
    global $expensy_db_entries;
    global $expensy_db_entry_cats;

    $request = $wpdb->prepare("DELETE entries.*, cats.* from $expensy_db_entries AS entries, $expensy_db_entry_cats AS cats WHERE entries.user_id=$user_id AND cats.user_id=$user_id;");

    $response = $wpdb->query($request);

    if ($response) return true;
    else return false;
}

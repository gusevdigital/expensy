<?php

function sql_process_entry_keys($data)
{
    $f_data = [];

    if (isset($data['date'])) $f_data['entry_date'] = $data['date'];
    if (isset($data['type'])) $f_data['entry_type'] = $data['type'];
    if (isset($data['amount'])) $f_data['entry_amount'] = $data['amount'];
    if (isset($data['cat'])) $f_data['entry_cat'] = $data['cat'];
    if (isset($data['note'])) $f_data['entry_note'] = $data['note'];

    return $f_data;
}

function sql_process_cat_keys($data)
{
    $f_data = [];

    if (isset($data['type'])) $f_data['cat_type'] = substr(esc_html($data['type']), 0, 3);
    if (isset($data['name'])) $f_data['cat_name'] = substr(esc_sql($data['name']), 0, 20);
    if (isset($data['color'])) $f_data['cat_color'] = substr(esc_sql($data['color']), 0, 20);

    return $f_data;
}

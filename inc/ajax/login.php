<?php

add_action('wp_ajax_nopriv_login', 'expensy_ajax_login');

function expensy_ajax_login()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    // Check data
    $user = get_user_by('email', $_POST['email']);

    $check = expensy_check_login_creds($_POST, $user);
    if (!$check['status']) {
        wp_die(json_encode($check));
    }

    // prepare creds
    $creds = [
        'user_login' => $user->user_login,
        'user_password' => $_POST['password'],
        'remember' => isset($_POST['remember']) && $_POST['remember'] === 'on' ? true : false
    ];

    // Sign in
    $user = wp_signon($creds, is_ssl());

    // Process
    if (is_wp_error($user)) {
        $data = array(
            'status' => 0,
            'message' => esc_html(strip_tags($user->get_error_message()))
        );
        wp_die(json_encode($data));
    } else {
        // Set current user and cookie
        wp_set_current_user($user->ID);
        wp_set_auth_cookie($user->ID);
        // Return success
        wp_die(json_encode([
            'status' => 1,
            'response' => $user->ID,
            'message' => 'Login successful, redirecting...',
        ]));
    }

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Something went wrong.'
    ]));
}

function expensy_check_login_creds($data, $user)
{
    // Check required fields
    $required = [];
    if ($data['email'] === '') $required[] = 'email';
    if ($data['password'] === '') $required[] = 'password';
    if ($required) return [
        'status' => 0,
        'message' => 'Please fill out all required fields.',
        'fields' => $required
    ];

    // Check email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) return [
        'status' => 0,
        'message' => 'Please check your Email address.',
        'fields' => ['email']
    ];

    // Check email user exists
    if (!$user) return [
        'status' => 0,
        'message' => 'Either the Email or password you entered is invalid.',
        'fields' => ['email']
    ];

    // Password is wrong
    if (!wp_check_password($data['password'], $user->data->user_pass, $user->ID)) return [
        'status' => 0,
        'message' => 'Either the Email or password you entered is invalid.',
        'fields' => ['password']
    ];

    return [
        'status' => 1
    ];
}

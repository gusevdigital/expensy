<?php

add_action('wp_ajax_nopriv_register', 'expensy_ajax_register');

function expensy_ajax_register()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }

    // Check data
    $check = expensy_check_register_data($_POST);
    if (!$check['status']) {
        wp_die(json_encode($check));
    }

    // Prepare data
    $data = [
        'user_login' => sanitize_user($_POST['email']),
        'user_email' => sanitize_email($_POST['email']),
        'user_pass' => esc_attr($_POST['password']),
        'first_name' => sanitize_text_field($_POST['name']),
        'user_nicename' => esc_attr($_POST['email']),
        'display_name' => sanitize_text_field($_POST['name']),
    ];

    $user = wp_insert_user($data);

    // Process register errors
    if (is_wp_error($user)) {
		$data = array(
			'status' => 0,
			'message' => esc_html(strip_tags($user->get_error_message()))
		);
        wp_die(json_encode($data));
	} else {
        if (!is_user_logged_in()) {
			$creds = array(
				'user_login'    => $data['user_login'],
				'user_password' => $data['user_pass'],
				'remember'      => true
			);
			$user_logged = wp_signon($creds, is_ssl());

            // Process login errors
            if (is_wp_error($user_logged)) {
                $data = array(
                    'status' => 0,
                    'message' => esc_html(strip_tags($user->get_error_message()))
                );
                wp_die(json_encode($data));
            } else {
                // Set current user and cookie
                wp_set_current_user($user_logged->ID);
                wp_set_auth_cookie($user_logged->ID);
                // Return success
                wp_die(json_encode([
                    'status' => 1,
                    'response' => $user_logged->ID,
                    'message' => 'Success! Redirecting...',
                ]));
            }
        }
	}

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Error register.'
    ]));
}

function expensy_check_register_data($data) {
    // Check required fields
    $required = [];
    if (empty($data['name'])) $required[] = 'name';
    if (empty($data['email'])) $required[] = 'email';
    if (empty($data['password'])) $required[] = 'password';
    if (empty($data['confirm_password'])) $required[] = 'confirm_password';
    if ($required) return [
        'status' => 0,
        'message' => 'Please fill out all required fields.',
        'fields' => $required
    ];

    // Check fields aren't too long
    $long = [];
    if (strlen($data['name']) >= 40) $long[] = 'name';
    if (strlen($data['email']) >= 40) $long[] = 'email';
    if (strlen($data['password']) >= 40) $long[] = 'password';
    if ($long) return [
        'status' => 0,
        'message' => 'Please make sure that the provided data is shorter that 40 characters.',
        'fields' => $long
    ];

    // Check email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL) || !validate_username($data['email'])) return [
        'status' => 0,
        'message' => 'Please check your Email address.',
        'fields' => ['email']
    ];

    // Check if user exists
    $user = get_user_by('email', $_POST['email']);
    if (username_exists($user->user_login)) return [
        'status' => 0,
        'message' => 'Email address already in use.',
        'fields' => ['email']
    ];

    // Password length
    if (12 > strlen($data['password'])) return [
        'status' => 0,
        'message' => 'Password must be at least 12 characters.',
        'fields' => ['password']
    ];

    // Passwords match
    if ($data['password'] !== $data['confirm_password']) return [
        'status' => 0,
        'message' => 'Password confirmation does not match.',
        'fields' => ['confirm_password']
    ];

    return [
        'status' => 1
    ];
}

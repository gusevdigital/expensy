<?php

add_action('wp_ajax_nopriv_reset', 'expensy_ajax_reset');

function expensy_ajax_reset()
{
    if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
        wp_die(json_encode([
            'status' => 0,
            'message' => 'Nonce error.'
        ]));
    }


    // Check data
    $user = get_user_by('email', $_POST['email']);
    $check = expensy_check_reset_email($_POST, $user);
    if (!$check['status']) {
        wp_die(json_encode($check));
    }

    // Reset password
    $reset = expensy_send_password_reset_mail($user);
    if ($reset) wp_die(json_encode([
        'status' => 1,
        'message' => 'Check your email for the reset link!',
    ]));
    else wp_die(json_encode([
        'status' => 0,
        'message' => 'Error sending the reset link',
    ]));

    // KBAI!
    wp_die(json_encode([
        'status' => 0,
        'message' => 'Something went wrong.'
    ]));
}

function expensy_check_reset_email($data, $user) {
    // Check required fields
    if (empty($data['email'])) return [
        'status' => 0,
        'message' => 'Please fill in your Email.',
        'fields' => ['email']
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
        'message' => 'Email you entered is invalid.',
        'fields' => ['email']
    ];

    return [
        'status' => 1
    ];
}

function expensy_send_password_reset_mail($user) {
    $first_name = $user->first_name;
    $email = $user->user_email;
    $adt_rp_key = get_password_reset_key($user);
    $user_login = $user->user_login;
    $rp_link = '<a style="display: inline-block;font-family:Arial; font-size: 14px;line-height: 1.5;font-weight: 600;padding:10px 20px;border: 2px solid #5450DC; background-color: white;border-radius: 7px;outline: none;color: #09090B;text-decoration: none;" href="' . wp_login_url() . "?action=rp&key=$adt_rp_key&login=" . rawurlencode($user_login) . '">Reset password</a>';

    $message = '<p style="color: #09090B;font-family: Arial;font-size: 14px; line-height: 1.5;">';
    $message .= "Hi";
    if ($first_name) $message .= ' <strong>' . $first_name . '</strong>';
    $message .= ',<br /><br />';
    $message .= "You've requisted a password reset on " . get_bloginfo( 'name' ) . " for email address $email <br><br>";
    $message .= "Click here to set the new password for your account: <br><br>";
    $message .= '</p>';
    $message .= $rp_link . '<br>';

   $subject = __("Reset password on " . get_bloginfo('name'));
   $headers = array();

   add_filter('wp_mail_content_type', function($content_type) {return 'text/html';});
   $headers[] = 'From: ' . get_bloginfo('name') . ' <' . get_bloginfo('admin_email') . '>'."\r\n";
   $sent = wp_mail($email, $subject, $message, $headers);

   // Reset content-type to avoid conflicts -- http://core.trac.wordpress.org/ticket/23578
   remove_filter('wp_mail_content_type', 'set_html_content_type');

   return $sent;
}

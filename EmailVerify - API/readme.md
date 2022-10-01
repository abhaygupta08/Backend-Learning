# Email Verify REST API

This is a simple REST API that verifies email addresses for valid MX records and SMTP connection.

## Usage

### Verify an email address

`GET METHOD`
```PUBLIC_URL/verify?email=EMAIL_ADDRESS```

### Verify Bulk Emails

`POST METHOD`
```PUBLIC_URL/verify```
```send txt file in body with emails on each line```

* register ApI

- url:/auth/register
- method: post
- request [header]: {content-Type:application/json}
- request [body]: {name, email,password}
- response [status]: success:201, failure:400
- response [header]: {content-Type:application/json}
- response [body]: {message, success, data}


------------------------

* verify Account ApI

- url:/auth/verify
- method: post
- request [header]: {content-Type:application/json}
- request [body]: {otp, email}
- response [status]: 200/400
- response [header]: {content-Type:application/json}
- response [body]: {message, success, data}


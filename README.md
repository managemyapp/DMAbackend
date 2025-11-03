# DMAbackend

## request form

In frontend there are 3 request forms, one is for asking help, 2nd one is to contact, 3rd one is to request a callback. their data look like these below

```
1st
form : {
    type : “help”,
    name : string,
    email : string,
    subject : string,
    problem : string,
    message : string
    }
```

```
2nd
form : {
    type : “contact”,
    name : string,
    email : string,
    phone : string,
    message : string
    }
```

```
3rd
form : {
    type : “callback”,
    name : string,
    phone : string,
    message : string
    }
```

all of these form will send a mail to a email and also store those data in a separate "request" collection. and in admin panel display all those requests from users. there will be only 3 types of requests those are "help", "contact", "callback". In admin panel tick mark requests that have responded.

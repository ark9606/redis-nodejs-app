# Redis Nodejs example

Start app `yarn start:dev`

Send request for creating user
```
curl --location 'localhost:3005/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Lilia5",
    "email": "lilia5@goooo.lo",
    "age": 5,
    "dreams": ["go to the park"]
}'
```

Send request for getting list of users sorted by age
```
curl --location 'localhost:3005/users'
```
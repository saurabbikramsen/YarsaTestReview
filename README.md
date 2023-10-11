
# Yarsa Play Review

## Features

  - Seed one Admin user by default
  - Admin can create, read, update, delete other admin and staff users
  - Player will have a default stats table by design
  - player can play games to increase their stats.
  - Player can be created by exposed api endpoint, without any guards
  - Admin can view and edit player info
  - Staff can only view player info
  - Admin can set a player inactive
  - Leaderboard system to get top 5 players
  - players can chat with each other
  - They can also create new room and join existing one
    - when you try join a room which was not present then new room is created with the given name.
  - you can trigger a SSE message event to notify user of some occurred event.

- Authentication and Authorization using guards
- Redis cache implementation for storing user leaderboard
- Play game to earn xp and coins
- Socket chat implementation for personal chats and room chats.


## Prerequisite

- nodejs v-16 or higher
- docker
- pnpm installed

## How To Get Started

- If pnpm not installed use code
    - npm install -g pnpm
- Create .env file
- Copy the variables in example.env to .env file
- Install and run postgres and redis in docker,
    - make sure port 5432 and 6379 are available
    - run code below:
```bash
  # install images and create docker container
  $ docker compose up -d
```

- In the env file
    - Set your 'ACCESS_TOKEN_SECRET' AND 'REFRESH_TOKEN_SECRET'
    - Provide expiry time (in minutes or hour or day) for access and refresh token
      - its value must be in format : 1m or 1h or 1d
    - Set an appropriate port number for nest-app in PORT variable


- Install all packages using command below.

```bash
  # install all packages
  $ pnpm install
```

- Apply all the migrations using command below.

```bash
  # apply all migrations
  $ prisma migrate dev
```

- Run the app locally using pnpm start:dev as below for development mode.

```bash
  # development watch mode
  $ pnpm start:dev
```

- After running locally 'http://localhost:[port]/api' is the route for swagger documentation.
  - Here you can see all the api endpoints present.
- Run tests to see that every thing is working properly.
  - Run unit tests using following command to see if all the functionalities are working properly.
```bash
  # run unit tests
  $ pnpm run test
```

  - Run e2e test which will seed(create) the first admin user:
     - email : saurab@gmail.com
     - password : saurab123


```bash
  # run e2e tests
  $ pnpm run test:e2e
```

- Create players and play games to increase their stats.
- Seed 100 players using command below.

```bash
  #seed 100 players
  $ pnpm seed
  ```
    - seed 100 players
    - The password for the seeded players is their_name123
    - See the seeded players using command below:

```bash
  # to view database data
  $ npx prisma studio
  ```
    - prisma studio will be running in: http://localhost:5555

- For socket APIs documentation 'http://localhost:[port]/async-api' is the provided route.
- or the socket API documentation is in bottom of this readme.md
- For socket client reference there is 3 clients present in the clients folder.
- Use socket documentation for chat system implementation.
- Now you can call these api's from the frontend when ever you want.


## Installation

```bash
  # install all packages
  $ pnpm install
```

```bash
  # apply all migrations
  $ prisma migrate dev
```



## Run Locally


```bash
  # development watch mode
  $ pnpm start:dev
```

```bash
  #seed 100 players
  $ pnpm seed
  ```


```bash
  # to view database data
  $ npx prisma studio
  ```

```bash
  # build mode
  $ nest build
```

```bash
  # production mode
  $ pnpm start:prod
```





## Test

```bash
  # unit tests
  $ pnpm run test
```

```bash
  # e2e tests
  $ pnpm run test:e2e
```


## async-api Documentation

## YarsaPlay Chat Api 1.0

## Channals


### SUB  "connect"

- it is used to connect to the server using socket

### Accepts following:

#### Headers
 ```json
{
    "authorization": "your bearer access token" 
}
```


### PUB  "privateMessage"

- it uses recipient id to send message to other connected users

### Accepts following:
#### Payload
 ```json
{
    "recipientId": "string id of the receiver",
    "message": "string message to be delivered"
}
```
### Emits following:
```json
{
    "message": "string message that was sent",
    "senderId": "string id of the sender"
}
```

### SUB  "join_room"

- it joins a user to a room using the room name
### Accepts following:
#### Payload
 ```json
{
    "roomName": "string"
}
```
### Returns following:
```json
{
    "message": "string"
}
```

### PUB  "message_room"

- provide room name and message to broadcast the message to all the users in the room

### Accepts following:
#### Payload
 ```json
{
    "roomName": "string",
    "message": "string message to be broadcasted"
}
```
### Emits following:
```json
{
    "message": "string message that was sent",
    "senderId": "string id of the sender",
    "roomName": "string"
}
```

### SUB  "leave_room"

- leave a room by providing room name.
### Accepts following:
#### Payload
 ```json
{
    "roomName": "string"
}
```
### Returns following:
```json
{
    "message": "string"
}
```

### PUB  "message_all"

- used to broadcast message to all the subscribed users
### Accepts following:
#### Payload
 ```json
{
    "message": "string message to be delivered"
}
```
### Emits following:
```json
{
    "message": "string message that was sent",
    "senderId": "string id of the sender"
}
```

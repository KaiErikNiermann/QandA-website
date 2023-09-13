# QandA discord bot frontend proxy

## Description

This is a frontend to users who want to answer questions which discord users asked using the Q&A discord bot. The idea being that it provides an interface for people to help others without having to log onto discord and join the server the bot is on. The way this works is that the bot and the website interface with the same database of questions and sync the information, with the bot relaying answers it detects the website users making to the original asker.

## Features

Currently this is still in very early development and likely very buggy, if you wish to contribute feel free to but I do not advise trying to host this yourself.

### Backend

- [x] Basic authentication
  - [ ] Email verification
- [x] Real time updates using changestreams and websockets
- [x] Basic data passing with bot
  - [ ] Improved data passing for markdown
  - [x] Endpoint for getting posts by `guildId`, `messageId`

### Frontend

- [x] Basic Homepage
  - [ ] Cleanup
- [x] Basic Auth page
  - [ ] Discord OAuth
  - [ ] Email verification additions
  - [ ] Cleanup
- [x] Post page
  - [ ] Cleanup

### Hosting and Deployment

- [ ] IAC solution using Terraform / Ansible
- [ ] GitHub action
  - [x] Basic testing
  - [ ] Full testing
  - [ ] Deployment
- [ ] Hosting setup
  - [x] Basic web server
  - [ ] Web server fully integrated
  - [ ] Better separation between dev and prod

## References

Credit to [_suhaildawood_](https://github.com/suhaildawood) for [their implementation](https://github.com/suhaildawood/SvelteKit-integrated-WebSocket) of first-class support for web sockets.

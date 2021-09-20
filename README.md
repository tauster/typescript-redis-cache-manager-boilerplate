# Cache Manager

#### Manager maintaining cache server actions

This is a simplified cache management system using redis. The goal for this system is to actively manage a cache layer for a database. The database used here is postgresql. The cache manager, when alive, allows other systems to apply data into the cache via redis, and the cache manager, well, manages the cache by bulk writing data queues into the database, handle active user sessions, and generally keep the cache from overloading.

The cache manager actively checks into the cache by applying an expiring key/value pair meant to let other systems know whether to use the cache or directly communicate with the database, in the event the cache manager server dies.

This system is heavily redacted. Some changes to the `redis.conf` will be required.

This repository is meant to showcase and used as a starting point and not maintained.

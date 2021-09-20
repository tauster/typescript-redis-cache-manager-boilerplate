# Cache Manager

#### Manager maintaining cache server actions

## Building and Deploying
-   `cd` into `cache_manager`
-   Run `npm run build:<runtime environment>`
    -   Choices for runtime environments include: `development`, `staging`, and `production`
-   Webpack will run and it will build and zip your package in the `cache_manager/dist` folder
-   Run `npm run deploy:<runtime environment>` to sync the S3 bucket hosting the code base
-   SSH into the runtime environment's EC2 instance, sync repos, and run `npm run server:local` or `npm run server:production_local` depending on server's runtime environment

## Running Local Environments
-   `cd` into `cache_manager`
-   Run `npm run build:<runtime environment>`
    -   Choices for runtime environments include: `development_local`, and `production_local`
-   IF THIS IS YOUR FIRST RUN, turn on your redis server using `npm run server-cache:local-persist`
    -   This will keep your redis cache server on in the background without having to restart at every build. You will have to do this if you shutdown or restarted your computer from the last run
    -   ONLY use this once. To test if your redis server is running, run `ps aux | grep redis-server` for an entry similar to the following (there could be 2 lines but the one below is the actual process):
        -   `tsharif  20558  0.0  0.0  49592  2060 ?        Ssl  15:21   0:00 redis-server *:6379`
    -   To shutdown your redis server in the event you want to restart it run `npm run server-cache:local-shutdown`
        -   User the above `grep` command to confirm the process is dead
-   To start local server, run `npm run server:local` or `npm run server:production_local` (both do the same thing)

## General Notes
-   Do not import the full `aws-sdk` package, or any other `externals` in webpack context. Only use the `cont packageName = require();` convention if needed
    -   This is because webpack has externals defined on the core packages which do not require bundling the imports
    -   Because of this only types/namespaces are able to be imported

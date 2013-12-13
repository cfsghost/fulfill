Fulfill
=======

You probably have thousands of ideas, but lack of time for realizing all of them. The big problem is, Infrastructure will surely takes a lot of time and energy, it turns out you can't focus on the most important thing during development.

Fulfill is a web service template, based on Node.js, frex.js and Semantic UI. It has done most of infrastructure things what web service should have, developer can realize own online service efficiently with ready-made framework.

Technologies
-

* Node.js
* MongoDB
* [Semantic UI](http://semantic-ui.com/) - Front-end UI toolkit
* Cookie-based session of express

Dependencies
-

* [frex.js](https://github.com/cfsghost/frex.js) - Express-based web framework
* [Courser](https://github.com/cfsghost/courser) - Route manager
* [Courlan](https://github.com/cfsghost/courlan) - Middleware manager

Usage
-

1. You can just clone or fork fulfill repository directly, then doing your job on it:

    ```
    git clone https://github.com/cfsghost/fulfill.git
    ```

2. Changing the working directory into:

    ```
    cd fulfill
    ```

3. Making a copy of example of configuration file and modify it for youself:
    
    ```
    cp configs/app.json.example configs/app.json
    ```

4. Installing dependencies:
    
    ```
    npm install .
    ```

5. Running your web service immediately:

    ```
    node app.js
    ```

Settings
-

All configurations are written in JSON format, it can be found in `configs` directory. you can just modify all of them for your web service.

### configs/app.json
---

You can configure fulfill with the following options:

* service_name - Web service name
* server_host - Domain name of service
* port - Port number
* secret_key - secret key for session


License
-
Licensed under the MIT License

Authors
-
Copyright(c) 2013 Fred Chien <<fred@mandice.com>>

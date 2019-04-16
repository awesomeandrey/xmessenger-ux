# xMessenger (UI/UX server)

This project is part of <b>xMessenger</b> application ecosystem. Written on NodeJS and ReactJS 
with Salesforce Lightning Design System applied.<br/>
Also, it's free cloud based browser messenger hosted on <i>Heroku</i> platform.

### Used technologies:

`websockets`, `reactjs`, `jsx`, `javascript`, `slds`, `travis`, `heroku`, `oauth`, `webpack`, `nodejs`

### Deployment

Continuous Delivery and Continuous Integration is achieved with the help of utility "Travis CI".<br/>
Luckily, it provides high-quality support and integration with "Heroku" platform with all required options.<br/>
In order to fulfil `.travis.yml` file with proper API token, follow next steps:
1) navigate to Linux environment (for example `Ubunutu 16.04`);
2) install `ruby` package (internally, it'll install `gem` package);
3) install `travis` package using `gem`;
4) run `travis encrypt $(heroku auth:token) --add deploy.api_key` to generate Heroku API key.

The eventual pipeline is as follows: every new push to GitHub repo will trigger a new build on Travis platform (or it can be initiated manually);<br/>
once the build is successful, the generated metadata gets moved and deployed on Heroku in a dedicated `dyno` (platform specific app container).

Aside from that, there are config variables established on Heroku platform. Those are accessible via Heroku UI or
CLI commands. They contain app sensitive information (API keys, DB credentials).

### Built With

* [WebStorm](https://www.jetbrains.com/webstorm/) - Integrated IDE
* [ReactJS](https://reactjs.org/) - Library for Making Interactive Websites
* [SLDS](https://www.lightningdesignsystem.com/getting-started/) - Salesforce Lightning Design System
* [SLDS for React](https://react.lightningdesignsystem.com/) - Lightning Design System for React
* [TravisCI](https://travis-ci.com/) - CI and CD web utility
* [Heroku](https://www.heroku.com/) - Cloud platform that lets companies build, deliver, monitor and scale apps
* [VivifyScrum](https://app.vivifyscrum.com/) - Issue tracking product which allows bug tracking and agile project management

### Versioning

For the versions available, see the [tags on this repository](https://github.com/awesomeandrey/xmessenger-ux/tags).

### Authors

* **Andrii Melnichuk** - *Initial work* - [awesomeandrey](https://github.com/awesomeandrey)
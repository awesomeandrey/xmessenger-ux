import React from 'react';
import GitHubLink from "../../common/components/github-link/GitHubLink";

import {
    Badge,
    Button,
    Col,
    Grid,
    Icon,
    MediaObject,
    PageHeader,
    PageHeaderHeading,
    Row
} from "react-lightning-design-system";
import {Navigation} from "../../../model/services/utility/NavigationService";

const About = _ => {
    return (
        <Grid className="slds-brand-band slds-brand-band_medium">
            <Row>
                <Col>
                    <div className="slds-align_absolute-center slds-m-top_large">
                        <div>
                            <PageHeader>
                                <PageHeaderHeading legend="Portfolio project" title="xMessenger"
                                                   figure={<Icon category="standard" size="medium" icon="connected_apps"/>}
                                                   rightActions={<Button type="brand" onClick={_ => Navigation.toLogin({})}>Try out</Button>}/>
                            </PageHeader>
                            <div className="slds-box slds-m-top_small slds-theme_default">
                                <MediaObject figureLeft={<img src="/public/pictures/xmessenger-logo.jpg"
                                                              width="100rem" alt="App logo"/>}>
                                    <p className="slds-p-vertical--small slds-text-heading_small">
                                        <span className="slds-text-title_caps">xMessenger</span> - free cloud based
                                        browser messenger hosted on <Badge>Heroku</Badge> platform.
                                    </p>
                                    <p className="slds-text-heading_small slds-p-bottom_x-small">
                                        Tools/technologies used:
                                    </p>
                                    <ul className="slds-has-dividers_around-space">
                                        <li className="slds-item"><a href="https://www.jetbrains.com/idea/">IntelliJ
                                            IDEA Ultimate</a> - Integrated IDE
                                        </li>
                                        <li className="slds-item"><a href="http://spring.io/">SpringBoot</a> - The
                                            backend framework (Java)
                                        </li>
                                        <li className="slds-item"><a href="https://maven.apache.org/">Maven</a> -
                                            Dependency Management utility
                                        </li>
                                        <li className="slds-item"><a href="https://reactjs.org/">ReactJS</a> - Library
                                            for Making Interactive Websites
                                        </li>
                                        <li className="slds-item"><a
                                            href="https://www.lightningdesignsystem.com/getting-started/">SLDS</a> -
                                            Lightning Design System
                                        </li>
                                        <li className="slds-item"><a href="https://travis-ci.com">TravisCI</a> - CI and
                                            CD web utility
                                        </li>
                                        <li className="slds-item"><a href="https://www.postgresql.org/">Postgre
                                            SQL</a> - The world's most advanced open source relational database
                                        </li>
                                        <li className="slds-item"><a href="https://www.heroku.com/">Heroku</a> - Cloud
                                            platform that lets companies build, deliver, monitor and scale apps
                                        </li>
                                        <li className="slds-item"><a
                                            href="https://app.vivifyscrum.com/">VivifyScrum</a> -
                                            Issue tracking product which allows bug tracking and agile project
                                            management
                                        </li>
                                    </ul>
                                </MediaObject>
                            </div>
                            <div className="slds-box slds-theme_shade slds-box_small slds-m-top_small slds-align_absolute-center">
                                <GitHubLink/>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Grid>
    );
};

export default About;
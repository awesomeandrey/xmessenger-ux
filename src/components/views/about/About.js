import React from "react";
import GitHubLink from "../../common/components/github-link/GitHubLink";
import PageHeader from "@salesforce/design-system-react/module/components/page-header";
import ButtonGroup from "@salesforce/design-system-react/module/components/button-group";
import Button from "@salesforce/design-system-react/module/components/button";
import Icon from "@salesforce/design-system-react/module/components/icon";
import MediaObject from "@salesforce/design-system-react/module/components/media-object";

import {Navigation} from "../../../model/services/utility/NavigationService";
import {Utility} from "../../../model/services/utility/UtilityService";

const items = [
    {
        name: "IntelliJ IDEA Ultimate",
        link: "https://www.jetbrains.com/idea/",
        description: "Integrated IDE.",
        iconName: "asset_relationship"
    },{
        name: "WebStorm",
        link: "https://www.jetbrains.com/webstorm/",
        description: "Integrated IDE primarily for web-developers.",
        iconName: "social"
    }, {
        name: "SpringBoot",
        link: "http://spring.io/",
        description: "The backend framework (Java).",
        iconName: "approval"
    }, {
        name: "Maven",
        link: "https://maven.apache.org/",
        description: "Dependency Management utility.",
        iconName: "flow"
    }, {
        name: "ReactJS",
        link: "https://reactjs.org/",
        description: "Library for making Interactive Websites.",
        iconName: "bot"
    }, {
        name: "SLDS",
        link: "https://www.lightningdesignsystem.com/getting-started/",
        description: "Salesforce Lightning Design System.",
        iconName: "custom_notification"
    }, {
        name: "TravisCI",
        link: "https://travis-ci.com",
        description: "CI and CD web utility.",
        iconName: "merge"
    }, {
        name: "PostgreSQL",
        link: "https://www.postgresql.org/",
        description: "The world\'s most advanced open source relational database.",
        iconName: "entity"
    }, {
        name: "Heroku",
        link: "https://www.heroku.com/",
        description: "Cloud platform that lets companies build, deliver, monitor and scale apps.",
        iconName: "product"
    }, {
        name: "VivifyScrum",
        link: "https://app.vivifyscrum.com/",
        description: "Issue tracking product which allows bug tracking and agile project management.",
        iconName: "task"
    }
];

const About = _ => {
    const navRight = (
        <div>
            <ButtonGroup>
                <Button label="Try out" onClick={_ => Navigation.toLogin({})} variant="brand"/>
            </ButtonGroup>
        </div>
    );
    return (
        <div className="slds-col slds-align_absolute-center">
            <div className="slds-m-around--x-small">
                <PageHeader iconCategory="standard" iconName="connected_apps"
                            label="Portfolio project" variant="objectHome"
                            navRight={navRight} truncate
                            title={<h1 className="slds-page-header__title slds-p-right_x-small">xMessenger</h1>}
                />
                <div className="slds-box slds-m-top_small slds-theme_default">
                    <div className="slds-illustration slds-illustration_small slds-text-align_center">
                        <img src="/public/pictures/xmessenger-logo.jpg" alt="Logo"
                             className="slds-avatar slds-m-bottom--small" style={{height: "5rem", width: "5rem"}}/>
                        <div className="slds-text-longform">
                            <h3 className="slds-text-heading_medium">
                                <b>xMessenger</b> - free cloud based browser messenger hosted on <u>Heroku</u> platform.
                            </h3>
                            <p className="slds-text-body_regular">Tools/technologies used:</p>
                        </div>
                    </div>
                    {(items.map(item => <MediaObject key={Utility.generateUniqueId()}
                                                     className="slds-m-vertical--x-small"
                                                     body={<p><a href={item.link} target="_blank">{item.name}</a> - {item.description}</p>}
                                                     figure={<Icon category="standard" name={item.iconName} size="small"/>}
                    />))}
                </div>
                <div className="slds-box slds-theme_shade slds-box_small slds-m-top_small slds-align_absolute-center">
                    <GitHubLink/>
                </div>
            </div>
        </div>
    );
};

export default About;
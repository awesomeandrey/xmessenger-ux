import React from "react";

import {GITHUB_REPO_URL} from "../../../../model/services/utility/NavigationService";

const GitHubLink = _ => {
    return (
        <div className="github-link">
            <span className="slds-avatar slds-avatar_small">
                <img src="/public/pictures/github-logo.png" alt="GitHub logo"/>
            </span>
            <a href={GITHUB_REPO_URL} target="_blank" className="slds-m-left--small">Fork on GitHub</a>
        </div>
    );
};

export default GitHubLink;
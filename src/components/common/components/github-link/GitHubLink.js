import React from "react";
import {ExternalResources} from "../../../../model/services/utility/NavigationService";

const GitHubLink = _ => {
    const openInNewTab = _ => {
        let win = window.open(ExternalResources.GITHUB_REPO_URL, '_blank');
        win.focus();
    };
    return (
        <div className="github-link">
            <span className="slds-avatar slds-avatar_small">
                <img src="/public/pictures/github-logo.png" alt="GitHub logo"/></span>
            <a href="#" onClick={openInNewTab} className="slds-m-left--small">Fork on GitHub</a>
        </div>
    )
};

export default GitHubLink;
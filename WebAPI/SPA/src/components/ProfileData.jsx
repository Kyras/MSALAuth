import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const ProfileData = (props) => {
    console.log("ProfileData props: ", props)
    let infoSection = []
    
    for (let [propName, propValue] of Object.entries(props.userInfo)) {
        console.log(`Displaying property ${propName}`, propValue)
        infoSection.push(<p><strong>{propName}: </strong> {propValue}</p>)
    }

    return (
        <>
            <div id="profile-div">
                {infoSection}
            </div>
        </>
    )
};
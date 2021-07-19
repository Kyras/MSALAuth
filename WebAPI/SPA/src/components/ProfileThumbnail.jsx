import React from "react";

/**
 * Renders user thumbnail
 * @param props
 */
export const ProfileThumbnail = (props) => {
    console.log("ProfileThumbnail props: ", props)
    return (
        <>
            <img src={props.thumbnail} alt="Thumbnail" height="64" width="64"/>
        </>
    )
}
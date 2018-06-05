import React from "react"

import profilePic from "./logo_gigpin.svg"

class Bio extends React.Component {
  render() {
    return (
      <p className="bio">
        <img src={profilePic} alt={`GigPin`} width="100" />
        Written by <strong>GigPin Engineering team</strong> who lives and works
        in San Francisco building useful things.{" "}
      </p>
    )
  }
}

export default Bio

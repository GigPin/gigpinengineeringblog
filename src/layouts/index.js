import React from 'react'
import Link from 'gatsby-link'

import logo from './logo-blog.svg'

const Header = () => (
  <nav>
    <img src={logo} width={40} />
    <Link to={'/'}>
      <span className="title">GigPin Engineering blog</span>
    </Link>
  </nav>
)

class Template extends React.Component {
  render() {
    const { location, children } = this.props

    return (
      <div>
        <Header />
        {children()}
      </div>
    )
  }
}

Template.propTypes = {
  children: React.PropTypes.func,
  location: React.PropTypes.object,
  route: React.PropTypes.object
}

export default Template

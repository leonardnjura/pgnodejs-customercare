import React, { Component, Fragment } from 'react';
import { NavLink, Tooltip } from 'reactstrap';
import LogoutIcon from 'mdi-react/LogoutIcon';

import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import PropTypes from 'prop-types';

class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };

  state = {
    tooltipOpen: false
  };

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,

    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <Fragment>
        <NavLink onClick={this.props.logout} href="#">
          <span id="logoutIcon">
            <LogoutIcon  />
          </span>
          <Tooltip
            placement="left"
            isOpen={this.state.tooltipOpen}
            target="logoutIcon"
            toggle={this.toggle}
          >
            Log out {isAuthenticated ? user.personnel_fname : ''} 
          </Tooltip>
        </NavLink>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  //name in root reducer(LHS)
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Logout);

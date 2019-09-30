import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  NavLink,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import IosPersonOutline from 'react-ionicons/lib/IosPersonOutline';


class LoginModal extends Component {
  state = {
    modal: false,
    personnel_fname: '',
    personnel_onames: '',
    personnel_phone: '',
    personnel_password: '',
    msg: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool, // not required
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props; // mapped below
    if (error !== prevProps.error) {
      //check for register error [passed with dispatch of returnErrors() in authActions]
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ msg: error.msg.msg }); // backend key has same name, :)
      } else {
        this.setState({ msg: null });
      }
    }

    // if authenticated, close modal
    if (this.state.modal) {
      if (isAuthenticated) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    // clear errors before re-showing modal
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    // form data
    const { personnel_phone, personnel_password } = this.state;

    // create user login object
    const user = {
      personnel_phone,
      personnel_password
    };

    // attempt login
    this.props.login(user);

  };

  render() {
    return (
      <div>
        <NavLink onClick={this.toggle} href="#">
          Login
        </NavLink>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} className="theme">
          <IosPersonOutline fontSize="33px" color="#43853d" />
          <br />
            Login to continue
            </ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Input
                  type="text"
                  name="personnel_phone"
                  id="personnel_phone"
                  placeholder="Phone.."
                  className="mb-3"
                  onChange={this.onChange}
                />
                <Input
                  type="password"
                  name="personnel_password"
                  id="personnel_password"
                  placeholder="Password.."
                  className="mb-3"
                  onChange={this.onChange}
                />
                <Button type="submit" style={{ marginTop: '2rem' }} block>
                Login
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  //name in root reducer(LHS)
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(
  mapStateToProps,
  { login, clearErrors }
)(LoginModal);

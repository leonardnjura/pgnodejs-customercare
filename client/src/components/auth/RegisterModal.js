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
import { registerUser } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import IosAdd from 'react-ionicons/lib/IosAdd';

class RegisterModal extends Component {
  //personnel_fname, personnel_onames, personnel_phone, personnel_password
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
    registerUser: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props; // mapped below
    if (error !== prevProps.error) {
      //check for register error [passed with dispatch of returnErrors() in authActions]
      if (error.id === 'REGISTER_FAIL') {
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
    const {
      personnel_fname,
      personnel_onames,
      personnel_phone,
      personnel_password
    } = this.state;

    // create user object
    const newUser = {
      personnel_fname,
      personnel_onames,
      personnel_phone,
      personnel_password
    };

    // submit
    this.props.registerUser(newUser);

    // close modal
    // this.toggle();
  };

  render() {
    return (
      <div>
        <NavLink onClick={this.toggle} href="#">
          Register
        </NavLink>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} className="theme">
          <IosAdd fontSize="33px" color="#43853d" />
          <br />
            Personnel Registration
          </ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Input
                  type="text"
                  name="personnel_fname" //  match label in state
                  id="personnel_fname"
                  placeholder="FirstName.."
                  className="mb-3"
                  onChange={this.onChange}
                />
                <Input
                  type="text"
                  name="personnel_onames"
                  id="personnel_onames"
                  placeholder="OtherNames.."
                  className="mb-3"
                  onChange={this.onChange}
                />
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
                  Register
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
  { registerUser, clearErrors }
)(RegisterModal);

import React, { Component, Fragment } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Tooltip,
  Row,
  Col
} from 'reactstrap';
import { connect } from 'react-redux';
import { addTask } from '../actions/taskActions';
import IosPersonOutline from 'react-ionicons/lib/IosPersonOutline';
import IosAdd from 'react-ionicons/lib/IosAdd';
import PropTypes from 'prop-types';

class TaskModal extends Component {
  state = {
    modal: false,
    tooltipOpen: false,
    customer_first_name: '',
    customer_last_name: '',
    customer_username: '',
    customer_comments: '',
    personnel_id: ''
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const newTask = {
      customer_first_name: this.state.customer_first_name,
      customer_last_name: this.state.customer_last_name,
      customer_username: this.state.customer_username,
      customer_comments: this.state.customer_comments,
      personnel_id: this.state.personnel_id
    };

    // add task via addTask action
    this.props.addTask(newTask);

    // close modal
    this.toggle();
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    let welcome = '';
    if (isAuthenticated) {
      welcome = user.personnel_fname;
      if (user.personnel_type_id === 3) {
        welcome = 'Admin';
      }
    }

    return (
      <div>
        {isAuthenticated ? (
          <Fragment>
            <Button
              color="dark"
              style={{ marginBottom: '2rem' }}
              onClick={this.toggle}
              id="addItem"
            >
              <IosAdd fontSize="23px" color="#43853d" />
              Add Task
            </Button>
            <div className="float-right">
              {welcome}
              <IosPersonOutline fontSize="33px" color="#43853d" />
            </div>

            <Tooltip
              placement="left"
              isOpen={this.state.tooltipOpen}
              target="addItem"
              toggle={this.toggleTooltip}
            >
              Add customer task to list
            </Tooltip>
          </Fragment>
        ) : (
          <h5 className="mb-3 ml-3">
            <span className="lol">!</span>Please login to view tasks
          </h5>
        )}

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} className="theme">
            <IosAdd fontSize="33px" color="#43853d" />
            <br />
            Create Task
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Row>
                  <Col sm="6">
                    <Input
                      type="text"
                      name="customer_first_name"
                      id="customer_first_name"
                      placeholder="Customer FirstName.."
                      className="mb-3"
                      onChange={this.onChange}
                    />
                  </Col>
                  <Col sm="6">
                    <Input
                      type="text"
                      name="customer_last_name"
                      id="customer_last_name"
                      placeholder="Customer LastName.."
                      className="mb-3"
                      onChange={this.onChange}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col sm="6">
                    <Input
                      type="text"
                      name="customer_username"
                      id="customer_username"
                      placeholder="Customer Phone.."
                      className="mb-3"
                      onChange={this.onChange}
                    />
                  </Col>
                  <Col sm="6">
                    <Input
                      type="number"
                      name="personnel_id"
                      id="personnel_id"
                      placeholder="Personnel ID.."
                      className="mb-3"
                      onChange={this.onChange}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm="12">
                    <Input
                      type="textarea"
                      rows="4"
                      name="customer_comments"
                      id="customer_comments"
                      placeholder="Customer Comments.."
                      // className="mb-3"
                      onChange={this.onChange}
                    />
                  </Col>
                </Row>
                <Button type="submit" style={{ marginTop: '2rem' }} block>
                  Save
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapSateToProps = state => ({
  task: state.task,
  auth: state.auth
});

export default connect(
  mapSateToProps,
  { addTask }
)(TaskModal);

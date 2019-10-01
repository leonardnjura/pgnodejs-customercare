import React, { Component, Fragment } from 'react';
import {
  Container,
  ListGroup,
  ListGroupItem,
  Button,
  Row,
  Col
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getTasks, deleteTask } from '../actions/taskActions';
import PropTypes from 'prop-types';
import CloseIcon from 'mdi-react/CloseIcon';
import classNames from 'classnames';

class TaskList extends Component {
  componentDidMount() {
    this.props.getTasks();
  }

  onDeleteClick = id => {
    this.props.deleteTask(id);
  };

  render() {
    const { tasks } = this.props.task;
    const { isAuthenticated, user } = this.props.auth;

    let isAdmin = false;
    if (isAuthenticated) {
      if (user.personnel_type_id === 3) {
        isAdmin = true;
      }
    }

    return (
      <Container>
        {isAuthenticated ? (
          <ListGroup>
            <TransitionGroup className="task-list">
              {tasks.map((currElement, index) => {
                const {
                  task_id,
                  customer_first_name,
                  customer_last_name,
                  task_status_name,
                  personnel_id,
                  customer_comments
                } = currElement;
                const completed = task_status_name === 'Completed';
                return (
                  <CSSTransition key={task_id} timeout={500} classNames="fade">
                    <ListGroupItem>
                      <Fragment>
                        {isAdmin ? (
                          <Button
                            className="remove-btn"
                            outline
                            color="danger"
                            size="sm"
                            onClick={this.onDeleteClick.bind(this, task_id)}
                          >
                            <CloseIcon fontSize="30px" color="#ccc" />
                          </Button>
                        ) : null}

                        <Row>
                          <Col sm="6">
                            <span className="list-no">{index + 1}.</span>
                            <ul className="subList">
                              <li>
                                <span>Task ID:</span> {task_id}
                              </li>
                              <li>
                                <span>Customer:</span> {customer_first_name}{' '}
                                {customer_last_name}
                              </li>

                              <li>
                                <span>Personnel Assigned:</span> {personnel_id}
                              </li>
                            </ul>
                          </Col>
                          <Col sm="6">
                            <h4 className="notes-header">notes..</h4>
                            <p className="notes">{customer_comments}</p>
                            <span
                              className={classNames({
                                theme: completed,
                                'bg-success': completed,
                                'bg-danger': !completed,
                                'px-1 mr-2': true
                              })}
                            ></span>
                            {task_status_name}
                          </Col>
                        </Row>
                      </Fragment>
                    </ListGroupItem>
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </ListGroup>
        ) : null}
      </Container>
    );
  }
}

TaskList.propTypes = {
  getTasks: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  task: state.task,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getTasks, deleteTask }
)(TaskList);

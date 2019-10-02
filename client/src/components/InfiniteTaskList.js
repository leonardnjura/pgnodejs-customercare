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
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import {
  getTasks,
  deleteTask,
  incrementTasksPage
} from '../actions/taskActions';
import PropTypes from 'prop-types';
import CloseIcon from 'mdi-react/CloseIcon';
import MyListBullet from 'mdi-react/CardsPlayingOutlineIcon';

class InfiniteList extends Component {
  constructor(props) {
    super(props);

    // Sets some local state?
    this.state = {};

    // Binds our scroll event handler
    window.onscroll = debounce(() => {
      const { error, hasMore, isLoading, pageNo } = this.props.task;

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (error || isLoading || !hasMore) return;

      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        this.props.incrementTasksPage();
        this.props.getTasks(pageNo);
      }
    }, 100);
  }

  componentWillMount() {
    // Loads some tasks on initial load
    this.props.getTasks(1);
  }

  onDeleteClick = id => {
    this.props.deleteTask(id);
  };

  render() {
    const { error, hasMore, isLoading, tasks } = this.props.task;
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
            <p>Scroll down to load more!</p>
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
                            <span className="list-no">
                              <MyListBullet fontSize="30px" color="#ccc" />
                            </span>

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
        ) : null}{' '}
        {error && <div style={{ color: '#900' }}>{error}</div>}
        {isLoading && <h4 className="fancy-big">loading..</h4>}
        {!hasMore && isAuthenticated && (
          <div>
            <h5 className="mt-3">
              <hr className="m-3" />
              <hr className="ml-4 mr-4" />
              <span className="lol">!</span>You reached the end
            </h5>
          </div>
        )}
      </Container>
    );
  }
}

InfiniteList.propTypes = {
  getTasks: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  task: state.task,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getTasks, deleteTask, incrementTasksPage }
)(InfiniteList);

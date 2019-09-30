import React, { Component, Fragment } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getTasks, deleteTask } from '../actions/taskActions';
import PropTypes from 'prop-types';
import CloseIcon from 'mdi-react/CloseIcon';

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

    let welcome = '';
    let isAdmin = false;
    if (isAuthenticated) {
      welcome = user.personnel_fname;
      console.log('FOO', user.personnel_type_id);
      if (user.personnel_type_id === 3) {
        isAdmin = true;
        welcome = 'Admin';
      }
    }
    // const list = [ 'h', 'e', 'l', 'l', 'o'];
    // list.map((currElement, index) => {
    //   console.log("The current iteration is: " + index);
    //   console.log("The current element is: " + currElement);
    //   console.log("\n");
    //   return currElement; //equivalent to list[index]
    // });

    return (
      <Container>
        {isAuthenticated ? ( <ListGroup>
          <TransitionGroup className="task-list">
            {tasks.map((currElement, index) => {
              
              const {
                task_id,
                customer_first_name,
                customer_last_name,
                task_status_name
              } = currElement
              console.log("NUMBER", index, customer_last_name)
              return(<CSSTransition key={task_id} timeout={500} classNames="fade">
              <ListGroupItem>
                 
                   <Fragment>
                   {isAdmin ? (<Button
                       className="remove-btn"
                       outline
                       color="danger"
                       size="sm"
                       onClick={this.onDeleteClick.bind(this, task_id)}
                     >
                       <CloseIcon fontSize="30px" color="#ccc" />
                     </Button>): null}
                     
                      <span className="list-no">{index+1}.</span>
                     <ul className="subList">
                       <li>
                         <span>Task ID:</span> {task_id}
                       </li>
                       <li>
                         <span>Customer:</span> {customer_first_name}{' '}
                         {customer_last_name}
                       </li>
                       <li>
                         <span>Status:</span> {task_status_name}
                       </li>
                     </ul>
                   </Fragment>
                 
               </ListGroupItem>
             </CSSTransition>)

            })}
            {/* {tasks.map(
              ({
                task_id,
                customer_first_name,
                customer_last_name,
                task_status_name
              }) => (
                <CSSTransition key={task_id} timeout={500} classNames="fade">
                 <ListGroupItem>
                    
                      <Fragment>
                      {isAdmin ? (<Button
                          className="remove-btn"
                          outline
                          color="danger"
                          size="sm"
                          onClick={this.onDeleteClick.bind(this, task_id)}
                        >
                          <CloseIcon fontSize="30px" color="#ccc" />
                        </Button>): null}
                        

                        <ul className="subList">
                          <li>
                            <span>Task ID:</span> {task_id}
                          </li>
                          <li>
                            <span>Customer:</span> {customer_first_name}{' '}
                            {customer_last_name}
                          </li>
                          <li>
                            <span>Status:</span> {task_status_name}
                          </li>
                        </ul>
                      </Fragment>
                    
                  </ListGroupItem>
                </CSSTransition>
              )
            )} */}
          </TransitionGroup>
        </ListGroup>) : null}
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
